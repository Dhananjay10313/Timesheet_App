# from fastapi import FastAPI, Depends, HTTPException

# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, Session
# from sqlalchemy import Column, Date, Integer, String
# from sqlalchemy.ext.declarative import declarative_base
# import jwt


# app = FastAPI()

# Base = declarative_base()


# class employee(Base):
#     __tablename__ = "employee" 


#     empid = Column(Integer, primary_key=True)
#     name = Column(String)
#     role = Column(String)
#     password = Column(Integer)  # Consider using a more secure password hashing mechanism
#     manager_id = Column(Integer)
#     department_id = Column(Integer)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modified_date = Column(Date)
#     isactive = Column(Integer)


# # Create engine
# engine = create_engine(r'mssql+pymssql://RA-INT\DSingh25:@93RRLQ2\SQLEXPRESS:1433/Timesheet_Database')

# # Create Session
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()



# @app.get("/")
# def root():
#     return {"message": "Sample books API is online"}



# def create_access_token(data: dict):
#     token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
#     return token



# def verify_token(token: str, db: Session = Depends(get_db)) -> bool:
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         user_id = payload.get("empid")
#         user = db.query(employee).filter(employee.empid == empid).first()
#         if user:
#             return True
#     except Exception as e:
#         raise HTTPException(status_code=401, detail="Invalid token")


# @app.post("/login")
# def login(employee: employee, db: Session = Depends(get_db)) -> dict:
#     # Authenticate the user (replace with your authentication logic)
    
#     authenticated_user = db.query(employee).filter(employee.empid == employee.empid, employee.password == employee.password).first()
#     if False:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")

#     # Create an access token
#     access_token = create_access_token({"empid": authenticated_user.empid})

#     return {"access_token": access_token}


from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
import jwt
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
  # Replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Replace with your SQL Server connection string
# SQLALCHEMY_DATABASE_URL = "mssql+pymssql://RA-INT\\DSingh25:@93RRLQ2\\SQLEXPRESS:1433/Timesheet_Database"
SQLALCHEMY_DATABASE_URL = 'mssql+pyodbc://@93RRLQ2\SQLEXPRESS/Timesheet_Database?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Replace with your secret key
SECRET_KEY = "your_secret_key"



Base = declarative_base()

# Define a model for user data
class Employee(Base):
    __tablename__ = "employee"

    empid = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String)
    password = Column(Integer)  # Consider using a more secure password hashing mechanism
    manager_id = Column(Integer)
    department_id = Column(Integer)
    created_by = Column(Integer)
    created_date = Column(Date)
    modified_by = Column(Integer)
    modify_date = Column(Date)
    isactive = Column(Integer)


class User(BaseModel):
    id: int

    class config:
        orm_mode=True

def create_access_token(data: dict):
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        empid = payload.get("empid")
        employee = db.query(Employee).filter(Employee.empid == empid).first()
        if employee and employee.password == payload.get("password"):
            return employee
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login")
async def login(data: Request, db: Session = Depends(get_db)):
    # data = data.json()
    # empid = data.get("empid")
    # password = data.get("password")
    # employee = db.query(Employee).filter(Employee.empid == empid).first()
    # print(employee.empid)
    # if employee and employee.password == password:
    #     access_token = create_access_token({"empid": employee.empid, "password": employee.password})
    #     return {"access_token": access_token}
    # else:
    #     raise HTTPException(status_code=401, detail="Incorrect username or password")
    mk=await data.json()
    kl=data.get("empid")
    return kl
    


@app.get("/protected")
def protected_endpoint(current_user: Employee = Depends(verify_token)):
    return {"message": f"Hello, {current_user.name}!"}


@app.post("/api/string")
async def handle_string(request: Request):
    data = await request.json()
    string_value = data.get("string_value")
    return data

@app.get('/kk')
def kk():
    return 0