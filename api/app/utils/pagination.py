from typing import TypeVar, Union

from sqlmodel import func, select
from sqlmodel.sql.expression import Select, SelectOfScalar

from app.database import Session
from app.models import PaginationMeta, PaginationQuery

T = TypeVar("T")


def paginate_query(
    session: Session,
    statement: Union[SelectOfScalar[T], Select[T]],
    pagination: PaginationQuery,
) -> tuple[list[T], PaginationMeta]:
    """Paginate a query"""
    total_count_statement = select(func.count("*")).select_from(statement.subquery())
    total_count = session.scalar(total_count_statement) or 0

    offset = (pagination.page - 1) * pagination.items_per_page

    data_statement = statement.offset(offset).limit(pagination.items_per_page)
    data = list(session.exec(data_statement).all())

    has_more = (offset + len(data)) < total_count

    meta = PaginationMeta(
        page=pagination.page,
        items_per_page=pagination.items_per_page,
        total_count=total_count,
        has_more=has_more,
    )

    return data, meta
