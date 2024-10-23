from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy import update as sqlalchemy_update, delete as sqlalchemy_delete, func
from app.database import async_session_maker


class BaseDAO:
    model = None

    @classmethod
    async def find_one_or_none_by_id(cls, data_id: int):
        """
            Asynchronously finds and returns a single model instance based on the specified criteria, or None.

            Arguments:
                data_id: Filter criteria represented by the record identifier.

            Returns:
                A model instance or None if nothing is found.
        """
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=data_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        """
        Asynchronously finds and returns a single model instance based on the specified criteria, or None.

        Arguments:
            **filter_by: Filtering criteria as named parameters.

        Returns:
            A model instance or None if nothing is found.
        """
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_all(cls, **filter_by):
        """
        Asynchronously finds and returns all model instances that match the specified criteria.

        Arguments:
            **filter_by: Filtering criteria as named parameters.

        Returns:
            A list of model instances.
        """
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def add(cls, **values):
        """
        Asynchronously creates a new model instance with the specified values.

        Arguments:
            **values: Named parameters for creating the new model instance.

        Returns:
            The created model instance.
        """
        async with async_session_maker() as session:
            async with session.begin():
                new_instance = cls.model(**values)
                session.add(new_instance)
                try:
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return new_instance
