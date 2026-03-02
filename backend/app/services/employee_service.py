from sqlalchemy.orm import Session
from fastapi import HTTPException
from .. import models, schemas, crud


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    return crud.create_employee(db, employee)


def get_employees(db: Session):
    return crud.get_employees(db)


def delete_employee(db: Session, employee_id: int):
    return crud.delete_employee(db, employee_id)


def count_employees(db: Session) -> int:
    return db.query(models.Employee).count()
