import os

import faiss
from llama_index.readers.file import PyMuPDFReader
from loguru import logger
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.vector_stores.faiss import FaissVectorStore

from src.utils import check_env_var


class ReportReader:
    def __init__(self, pdf_name: str, data_dir: str, save_dir: str, dimensions: str):
        self.pdf_name = pdf_name
        self.data_dir = data_dir
        self.save_dir = save_dir
        self.dimensions = dimensions

        self.index = None
        self.storage_context = None
        self.vector_store = None
        self.documents = None
        self.faiss_index = None
        self.query_engine = None

        check_env_var(["OPENAI_API_KEY"])

    def initialize_faiss_index(self) -> faiss.IndexFlatL2:
        logger.debug("Initializing FAISS index with dimensions: {}", self.dimensions)
        return faiss.IndexFlatL2(self.dimensions)

    def load_documents(self):
        loader = PyMuPDFReader()
        file_path = self.data_dir / self.pdf_name
        logger.info(f"Loading documents from file : {file_path}")
        return loader.load(file_path=file_path)

    def create_vector_store_index(self) -> VectorStoreIndex:
        logger.debug("Creating vector store index from documents")
        return VectorStoreIndex.from_documents(
            self.documents, storage_context=self.storage_context
        )

    def save_index_to_disk(self) -> None:
        logger.debug("Saving index to disk")
        self.index.storage_context.persist(persist_dir=self.save_dir)

    def ask(self, text: str):
        assert self.index is not None, "Index not initialized. Please run 'run' first."
        res = self.query_engine.query(text)
        return res

    def run(self) -> None:
        self.faiss_index = self.initialize_faiss_index()
        self.vector_store = FaissVectorStore(faiss_index=self.faiss_index)

        self.documents = self.load_documents()
        self.storage_context = StorageContext.from_defaults(
            vector_store=self.vector_store
        )
        self.load_index()

    def load_index(self) -> None:
        if not os.path.exists(self.save_dir / "default__vector_store.json"):
            logger.debug("Saving index to disk")
            self.index = self.create_vector_store_index()
            self.save_index_to_disk()
        else:
            logger.debug("Loading index from disk")
            vector_store = FaissVectorStore.from_persist_dir(persist_dir=self.save_dir)
            storage_context = StorageContext.from_defaults(
                vector_store=vector_store, persist_dir=self.save_dir
            )
            self.index = load_index_from_storage(storage_context=storage_context)

        self.query_engine = self.index.as_query_engine()