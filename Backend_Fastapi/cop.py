from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date
import pyodbc
from typing import Any
import jwt
from datetime import datetime

from datetime import date

# from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from model import Employee
from model import Department, EmployeeProjects, Leaves, typeOfLeave, Timesheet, Ticket, EmployeeProjects, TimesheetApproval, Alert, Project
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from sqlalchemy import extract, text
from sqlalchemy import update

################################################################
import logging
import json
from datetime import datetime
from pytz import UTC

# Create a custom logging handler
class JsonFileHandler(logging.FileHandler):
    def emit(self, record):
        log_entry = self.format(record)
        with open(self.baseFilename, 'a') as f:
            f.write(log_entry + '\n')

# # Set up the logger
logger = logging.getLogger('jsonLogger')
logger.setLevel(logging.DEBUG)

# # Create a file handler that logs messages in JSON format
json_handler = JsonFileHandler('json_logs.log')
json_handler.setLevel(logging.DEBUG)

# # Create a custom formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            'Username': record.username,
            'Log_id': record.log_id,
            'Timestamp': datetime.now(UTC).isoformat(),
            'Values': record.values
        }
        return json.dumps(log_record)

json_handler.setFormatter(JsonFormatter())
logger.addHandler(json_handler)

# Log messages with the fixed JSON structure
# def #log_error(whatfailed,reason):
#     logger.info('', extra={
#         'username': 'dhananjay',
#         'log_id': 1,
#         'values': {
#             'iserrorlog':1,
#             'whatfailed': whatfailed,
#             'reason':reason
#         }
#     })

# def #log_it(message):
#     logger.info('', extra={
#         'username': 'dhananjay',
#         'log_id': 1,
#         'values': {
#             'iserrorlog':0,
#             'message':message
#         }
#     })

def log_timesheet(type,hours,emp):
    logger.info('', extra={
        'username': 'dhananjay',
        'log_id': 1,
        'values': {
            'iserrorlog':0,
            'activity': 'timesheet', 
            'type':type, #logged, accept
            'hours':hours,
            'emp': emp
        }
    })

def log_leave(type,days,leave_type):
    logger.info('', extra={
        'username': 'dhananjay',
        'log_id': 1,
        'values': {
            'iserrorlog':0,
            'activity': 'leave',
            'type':type, #apply,accept,reject
            'days':days,
            'leave_type': leave_type
        }
    })

def log_ticket(type,creator,referred):
    logger.info('', extra={
        'username': 'dhananjay',
        'log_id': 1,
        'values': {
            'iserrorlog':0,
            'activity': 'ticket',
            'type':type, #created,closed
            'creator':creator,
            'referred':referred
        }
    })

def log_project():
    logger.info('', extra={
        'username': 'dhananjay',
        'log_id': 1,
        'values': {
            'iserrorlog':0,
            'activity': 'project',
        }
    })

################################################################


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


from pydantic import BaseModel

from typing import List, Dict

class EmployeeBase(BaseModel):
    empid: int
    name: str
    role: str
    password: str  # Placeholder for hashed password
    manager_id: int | None  # Optional, as manager_id can be null
    department_id: int
    created_by: int
    created_date: date
    modified_by: int
    modify_date: date
    isactive: bool


class TimesheetBase(BaseModel):
    timesheet_id: Optional[int] = None
    start_time: datetime
    end_time: datetime
    task_name: str
    project_id: int
    employee_id: int
    manager_id: int
    status: int
    # created_by: int
    # created_date: datetime
    # modified_by: int
    # modify_date: datetime
    # isactive: int


class TicketBase(BaseModel):
    # ticket_id: int 
    create_at: date
    description: str
    status: int
    creator_id: int
    project_id: int
    ref_employee_id: int
    created_by: int
    created_date: date
    modified_by: int
    modify_date: date
    isactive: int

    class Config:
        orm_mode = True


class AlertBase(BaseModel):
    alt_id: Optional[int]
    alert_name: Optional[str]
    employee_id: int
    status: Optional[int] = 0


class reqBase(BaseModel):
    emp_id: Optional[int] = None
    manager_id: Optional[int] = None
    ap_id: Optional[int] = None
    project_id: Optional[int] = None
    start_time: Optional[date] = None
    end_time: Optional[date] = None
    password: Optional[str] = None
    timesheet_id: Optional[int] = None



class userBase(BaseModel):
    emp_id: Optional[int] = None
    manager_id: Optional[int] = None
    ap_id: Optional[int] = None
    project_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    password: Optional[str] = None
    timesheet_id: Optional[int] = None

class updateLeaveBase(BaseModel):
    id: int
    status: int


class addProjectBase(BaseModel):
    employee_id: int
    project_id: int


class approvalBase(BaseModel):
    ap_id:Optional[int] = None
    employee_id:int
    manager_id:int
    status:Optional[int]=1
    created_at:Optional[datetime]=datetime.now()

class RequestBody(BaseModel):
    id:int
    closing_comments: Optional[str] = None

class addAlertBase(BaseModel):
    alt_id: Optional[int] = None
    employee_id: Optional[int] = None
    alt_type: Optional[int] = None
    alt_description: Optional[str] = None
    status: Optional[int] = None


class commonProjectBase(BaseModel):
    emp_id: int
    co_emp_id: int


class addTicketBase(BaseModel):
    ticket_id: int 
    create_at: date
    description: str
    status: int
    creator_id: int
    project_id: int
    ref_employee_id: int

class updateRemBase(BaseModel):
    emp_id:int
    t_id:int
    days:int


class LeaveRequestBase(BaseModel):
    leave_id: Optional[int] = None
    start_time: date
    end_time: date
    reason: str
    t_id: int
    status: int
    manager_id: int
    employee_id: int


class projectAddBase(BaseModel):
    project_id: int
    name: str
    description: str
    start_date: date
    deadline: date
    employee_count: int
    manager_id: int


class EmployeeRef(BaseModel):
    employee_id: int
    name: str
    role: str
    manager_id: int
    projects: List[int]
    LoggedHrs: int = 0
    LeaveDays: int = 0



    

def create_access_token(data: dict):
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str, db: Session = Depends(get_db)):
    # try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    empid = payload.get("empid")
    # print(type(empid))
    user = db.query(Employee).filter(Employee.empid == empid).first()
        # print(user)
        # if user:
        #     return user
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Invalid token")


class passReq(BaseModel):
    id: int
    key: str



from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
# from passlib.context import CryptContext
from pydantic import BaseModel

# to get a string like this run:
# openssl rand -hex 32

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

from passlib.context import CryptContext

from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/token")
async def login_for_access_token(
    request: passReq,
    db: Session = Depends(get_db)
) -> Token:
    try:
        id = request.id
        plain_password = request.key
        
        user = db.query(Employee).filter(Employee.empid == id).first()

        if not user or not verify_password(plain_password, user.password):
            #log_error("Login failed", "Incorrect username or password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.empid, 'iat': datetime.datetime.utcnow(),}, expires_delta=access_token_expires
        )
        
        #log_it(f"User {id} logged in successfully")
        return Token(access_token=access_token, token_type="bearer")
    except Exception as e:
        #log_error("Login error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if(datetime.fromtimestamp(payload.get("exp"))<datetime.now()):
            print("Token expired")
            raise credentials_exception
        if username is None:
            raise credentials_exception
        
    except ExpiredSignatureError:
        print("Token has expired")
        
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
        issued_at = decoded_token.get('iat')
        if issued_at:
            issued_at_time = datetime.datetime.fromtimestamp(issued_at)
            current_time = datetime.datetime.utcnow()
            time_difference = current_time - issued_at_time
            if time_difference > datetime.timedelta(days=1):
                raise Exception("Token Expired")
            else:
                access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                access_token = create_access_token(
                    data={"sub": 1, 'iat': issued_at}, expires_delta=access_token_expires
                )
            return Token(access_token=access_token, token_type="bearer")
        else:
            raise credentials_exception
        return "ok"
    except InvalidTokenError:
        #log_error("Token validation failed", "Invalid token")
        
        raise credentials_exception
    return "ok"


@app.post("/login")
async def login(request: passReq, db: Session = Depends(get_db)):
    try:
        id = request.id
        password = request.key
        
        authenticated_user = db.query(Employee).filter(Employee.empid == id, Employee.password == password).first()
        
        if not authenticated_user:
            #log_error("Login failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        access_token = create_access_token({"empid": authenticated_user.empid})
        #log_it(f"User {id} logged in successfully")
        return access_token
    except Exception as e:
        #log_error("Login error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/protected/getEmployee/employee")
def protected_endpoint(current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        results = db.query(Employee, EmployeeProjects).join(Employee, Employee.empid == EmployeeProjects.employee_id)
        
        result_list = []
        for department, employee in results:
            result_list.append({
                "department_name": department.name,
                "employee_name": employee.name
            })
        
        #log_it(f"Retrieved employee data for user {current_user.empid}")
        return result_list
    except Exception as e:
        #log_error("Get employee data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getTimesheetDataByUser")
def get_timsheet_data_by_user(current_user: userBase, db: Session = Depends(get_db)):
    try:
        emp_id = current_user.emp_id
        timsheet_data_user = db.query(Timesheet).filter(Timesheet.employee_id == emp_id).all()
        
        if not timsheet_data_user:
            #log_error("Timesheet data retrieval failed", "No timesheet data found for user")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        for timesheet in timsheet_data_user:
            result_list.append({
                "id": timesheet.timesheet_id,
                "start": timesheet.start_time.strftime("%Y-%m-%dT%H:%M:%S"),
                "end": timesheet.end_time.strftime("%Y-%m-%dT%H:%M:%S"),
                "text": timesheet.task_name,
                "project": timesheet.project_id,
                "employee_id": timesheet.employee_id,
                "status": timesheet.status,
                "manager_id": timesheet.manager_id
            })
        
        #log_it(f"Retrieved timesheet data for user {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Timesheet data retrieval error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getTimesheetApprovalRequestByManager")
def get_timesheet_data_by_manager(req: userBase, db: Session = Depends(get_db)):
    try:
        timsheet_data_user = db.execute(text("select employee_id, ap_id, created_at, name, status from employee a join timesheetApproval b on a.empid=b.employee_id where a.manager_id=:user_id"), {'user_id': req.manager_id}).fetchall()
        
        if not timsheet_data_user:
            #log_error("Timesheet approval request retrieval failed", "No timesheet approval requests found for manager")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        cnt = 0
        for timesheet in timsheet_data_user:
            result_list.append({
                "id": cnt,
                "employee_id": timesheet.employee_id,
                "name": timesheet.name,
                "ap_id": timesheet.ap_id,
                "created_at": timesheet.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "status": timesheet.status,
            })
            cnt += 1
        
        #log_it(f"Retrieved timesheet approval requests for manager {req.manager_id}")
        return result_list
    except Exception as e:
        #log_error("Timesheet approval request retrieval error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/postTimesheetApproveReq")
async def post_approve_req(req: userBase, db: Session = Depends(get_db)):
    try:
        ap_id = req.ap_id
        ticket_data_Refuser = db.query(TimesheetApproval).filter(TimesheetApproval.ap_id == ap_id).first()

        if not ticket_data_Refuser:
            #log_error("Timesheet approval failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        emp_id = ticket_data_Refuser.employee_id
        timesheet_data_user = db.query(Timesheet).filter(Timesheet.employee_id == emp_id, Timesheet.status!=2).all()

        total_hours_accepted=0
        for timesheet in timesheet_data_user:
            if(timesheet.status!=2):
                time_logged=(timesheet.end_time-timesheet.start_time).total_seconds()/3600
                total_hours_accepted+=time_logged
            timesheet.status = 2

        log_timesheet('accept',total_hours_accepted,emp_id)

        ticket_data_Refuser.status = 2
        db.commit()

        #log_it(f"Timesheet approved for employee {emp_id} by manager {req.manager_id}")
        return total_hours_accepted
    except Exception as e:
        #log_error("Timesheet approval error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/postTimesheetRejectReq")
async def post_reject_req(req: userBase, db: Session = Depends(get_db)):
    try:
        ap_id = req.ap_id
        ticket_data_Refuser = db.query(TimesheetApproval).filter(TimesheetApproval.ap_id == ap_id).first()

        if not ticket_data_Refuser:
            #log_error("Timesheet rejection failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        ticket_data_Refuser.status = 3
        db.commit()

        #log_it(f"Timesheet rejected for approval ID {ap_id} by manager {req.manager_id}")
        return 1
    except Exception as e:
        #log_error("Timesheet rejection error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/postTimesheetDataByUser")
def post_timesheet_data(newEntry: TimesheetBase, db: Session = Depends(get_db)):
    try:

        emp_id = newEntry.employee_id
        timesheet_Record = Timesheet(**newEntry.dict())

        db.add(timesheet_Record)
        db.commit()
        db.refresh(timesheet_Record)
        time_logged=(newEntry.end_time-newEntry.start_time).total_seconds()/ 3600
        log_timesheet('logged',time_logged,newEntry.employee_id)

        #log_it(f"Timesheet data posted for employee {emp_id}")
        return timesheet_Record
    except Exception as e:
        #log_error("Post timesheet data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")



@app.post("/addTimesheetForApproval")
def timesheet_approval(newEntry: approvalBase, db: Session = Depends(get_db)):
    try:
        timesheet_Record = TimesheetApproval(**newEntry.dict())

        db.add(timesheet_Record)
        db.commit()
        db.refresh(timesheet_Record)

        #log_it(f"Timesheet approval request added for employee {newEntry.employee_id} by manager {newEntry.manager_id}")
        return timesheet_Record
    except Exception as e:
        #log_error("Add timesheet approval request error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


# @app.get("/getTicketDataByUser")
# def get_ticket_data(current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):
#     emp_id=current_user.empid

#     ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
#     # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

#     if not ticket_data_Creatoruser:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
    
#     result_list = []
#     for ticket in ticket_data_Creatoruser:
#         result_list.append({
#             "ticket_id": ticket.ticket_id,
#             "create_at": ticket.create_at,
#             "description": ticket.description,
#             "status": ticket.status,
#             "ref_employee_id": ticket.ref_employee_id
#         })
    
#     return result_list


@app.delete("/deleteTimesheetData")
async def delete_items_by_condition(req: userBase, db: Session = Depends(get_db)):
    try:
        emp_id = req.emp_id

        query = db.query(Timesheet).filter(
            Timesheet.employee_id == emp_id,
            Timesheet.status==1
        )

        items_to_delete = query.all()

        if items_to_delete:
            for item in items_to_delete:
                db.delete(item)
            db.commit()
            #log_it(f"Timesheet data deleted for employee {emp_id}")
            return {"message": "Items deleted successfully"}
        else:
            #log_error("Delete timesheet data failed", "Items not found")
            raise HTTPException(status_code=404, detail="Items not found")
    except Exception as e:
        #log_error("Delete timesheet data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error1")

@app.post("/postTicketDataByUser")
def post_ticket_data(newEntry: TicketBase, current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        emp_id = current_user.empid
        ticket_Record = Ticket(**newEntry.dict())

        db.add(ticket_Record)
        db.commit()
        db.refresh(ticket_Record)

        #log_it(f"Ticket data posted by user {emp_id}")
        return ticket_Record
    except Exception as e:
        #log_error("Post ticket data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getTicketDataByUser")
async def get_ticket_data(req: RequestBody, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        emp_id = req.id
        ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)

        if not ticket_data_Creatoruser:
            #log_error("Get ticket data failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for ticket in ticket_data_Creatoruser:
            result_list.append({
                "ticket_id": ticket.ticket_id,
                "create_at": ticket.create_at,
                "description": ticket.description,
                "status": ticket.status,
                "closing_comments": ticket.closing_comments,
                "project_id": ticket.project_id,
                "ref_employee_id": ticket.ref_employee_id
            })

        #log_it(f"Retrieved ticket data for user {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get ticket data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getTicketDataByRefUser")
async def get_ticket_by_refuser(req: RequestBody, db: Session = Depends(get_db)):
    try:
        emp_id = req.id
        ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

        if not ticket_data_Refuser:
            #log_error("Get ticket data by ref user failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for ticket in ticket_data_Refuser:
            result_list.append({
                "ticket_id": ticket.ticket_id,
                "ref_employee_id": ticket.ref_employee_id,
                "creator_id": ticket.creator_id,
                "description": ticket.description,
                "project_id": ticket.project_id,
                "create_at": ticket.create_at,
                "closing_comments": ticket.closing_comments,
                "status": ticket.status,
            })

        #log_it(f"Retrieved ticket data for ref user {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get ticket data by ref user error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/updateTicketDataToDone")
async def update_ticket_done(req: RequestBody, db: Session = Depends(get_db)):
    try:
        tick_id = req.id

        stmt = (
            update(Ticket)
            .where(Ticket.ticket_id == tick_id)
            .values(status=1, closing_comments=req.closing_comments)
        )

        changed_ticket = db.query(Ticket).filter(Ticket.ticket_id == tick_id).first()
        log_ticket('closed',changed_ticket.creator_id,changed_ticket.ref_employee_id)


        db.execute(stmt)
        db.commit()

        #log_it(f"Ticket {tick_id} status updated to done")
        return 1
    except Exception as e:
        #log_error("Update ticket data to done error", str(e))
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/fetchProjectsForEmployee")
async def get_ticket_by_refuser(req: RequestBody, db: Session = Depends(get_db)):
    try:
        emp_id = req.id
        ticket_data_Refuser = db.query(Leaves)  # .filter(EmployeeProjects.employee_id == emp_id)

        if not ticket_data_Refuser:
            #log_error("Fetch projects for employee failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for ticket in ticket_data_Refuser:
            result_list.append({
                "employee_id": ticket.employee_id,
                "project_id": ticket.project_id,
            })

        #log_it(f"Fetched projects for employee {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Fetch projects for employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/addTicketDataToTable")
async def update_ticket_donee(req: addTicketBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        db_item = Ticket(**req.dict())
        db.add(db_item)
        db.commit()

        log_ticket('created',req.creator_id,req.ref_employee_id)

        #log_it(f"Ticket data added to table for ticket ID {req.ticket_id}")
        return 1
    except Exception as e:
        #log_error("Add ticket data to table error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getLeaveDataByUser")
def get_leaves(request: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        leave_records = db.query(Leaves).filter(Leaves.employee_id == request.emp_id).all()

        result_list = []
        for leave in leave_records:
            result_list.append({
                "leave_id": leave.leave_id,
                "start_date": leave.start_time,
                "end_date": leave.end_time,
                "reason": leave.reason,
                "type": leave.t_id,
                "status": leave.status,
            })

        #log_it(f"Retrieved leave data for user {request.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get leave data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getLeavesRemaining")
def get_leave_remaining(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        emp_id = req.emp_id
        leave_remaining = db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id)

        if not leave_remaining:
            #log_error("Get leaves remaining failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for ticket in leave_remaining:
            result_list.append({
                "employee_id": ticket.employee_id,
                "t_id": ticket.t_id,
                "t_days": ticket.t_days,
                "balance": ticket.balance,
                "name": ticket.t_name
            })

        #log_it(f"Retrieved remaining leaves for employee {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get leaves remaining error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    




# @app.post("/updateRemainingLeaves")
# def update_rem_leaves(req:updateRemBase, db: Session = Depends(get_db)):
#     emp_id=req.emp_id,
#     t_id=req.t_id,
#     days=req.days
#     update_rem_leaves=db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id, typeOfLeave.t_id==t_id).one()
#     # leave_remaining = db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id).first()

#     if not update_rem_leaves:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")


#     # for row in update_rem_leaves:
#     print(update_rem_leaves.t_id)
#     # dys=update_rem_leaves.t_days
#     # update_rem_leaves.t_days=dys-days

#     # db.commit()

#     return 1
@app.post("/updateRemainingLeaves")
def get_leave(request: updateRemBase, db: Session = Depends(get_db)):
    try:
        leave_record = db.query(typeOfLeave).filter(typeOfLeave.employee_id == request.emp_id, typeOfLeave.t_id == request.t_id).one()
    except Exception as e:
        #log_error("Update remaining leaves failed", "Leave record not found")
        raise HTTPException(status_code=404, detail="Leave record not found")

    employee_id = leave_record.balance
    hdf = leave_record.balance
    leave_record.balance = hdf - request.days
    db.commit()

    #log_it(f"Updated remaining leaves for employee {request.emp_id}")
    return {"employee_id": employee_id, "leave_record": leave_record}


@app.post("/addLeaveDataToTable")
async def push_leave_data_to_table(req: LeaveRequestBase, db: Session = Depends(get_db)):
    try:
        db_item = Leaves(**req.dict())
        db.add(db_item)
        db.commit()


        day_diff = (req.end_time-req.start_time).total_seconds()/(3600*24)
        day_diff+=1
        log_leave('apply',day_diff,req.t_id)
        #log_it(f"Leave data added to table for employee {req.employee_id}")
        return 1
    except Exception as e:
        #log_error("Add leave data to table error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getLeaveDataByManager")
def get_leave_data_by_user(req: RequestBody, db: Session = Depends(get_db)):
    try:
        emp_id = req.id
        leave_data_Creatoruser = db.query(Leaves).filter(Leaves.manager_id == emp_id).all()

        if not leave_data_Creatoruser:
            #log_error("Get leave data by manager failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for leave in leave_data_Creatoruser:
            result_list.append({
                "leave_id": leave.leave_id,
                "employee_id": leave.employee_id,
                "start_date": leave.start_time,
                "end_date": leave.end_time,
                "reason": leave.reason,
                "type": leave.t_id,
                "status": leave.status,
            })

        #log_it(f"Retrieved leave data for manager {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get leave data by manager error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")



@app.post("/updateLeaveDataToDoneorReject")
async def update_ticket_done(req: updateLeaveBase, db: Session = Depends(get_db)):
    try:
        id = req.id
        status = req.status
        ticket_data_Refuser = db.query(Leaves).filter(Leaves.leave_id == id).first()

        if not ticket_data_Refuser:
            #log_error("Update leave data failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        day_diff = (ticket_data_Refuser.end_time-ticket_data_Refuser.start_time).total_seconds()/(86400)
        if(status==2):
            log_leave('accept',day_diff,ticket_data_Refuser.t_id)
        else:
            log_leave('reject',day_diff,ticket_data_Refuser.t_id)

        ticket_data_Refuser.status = status
        db.commit()

        #log_it(f"Leave data updated to status {status} for leave ID {id}")
        return 1
    except Exception as e:
        #log_error("Update leave data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


# @app.post("/addAlerts")
# async def add_alerts(req:AlertBase, db: Session = Depends(get_db)):
#     add_item=Alert(**req.dict())

#     if not add_item:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
    
#     db.add(add_item)
#     db.commit()
#     db.refresh(add_item)
    
#     return 1

@app.post("/getProjectDataByuser")
async def get_project_data(req: userBase, db: Session = Depends(get_db)):
    try:
        emp_id = req.emp_id
        project_list = db.execute(text("SELECT * FROM EmployeeProjects a join Project b on a.project_id=b.project_id where a.employee_id= :user_id"), {'user_id': req.emp_id}).fetchall()

        if not project_list:
            #log_error("Fetch project data failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for project in project_list:
            result_list.append({
                "project_id": project.project_id,
                "name": project.name
            })

        #log_it(f"Fetched project data for employee {emp_id}")
        return result_list
    except Exception as e:
        #log_error("Fetch project data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getHrsWorkedPerDay")
def get_timesheets(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        timesheets = db.execute(text("SELECT * FROM timesheet WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 and timesheet.status=2 ORDER BY timesheet.start_time"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

        if not timesheets:
            #log_error("Fetch hours worked per day failed", "Timesheets not found")
            raise HTTPException(status_code=404, detail="Timesheets not found")

        hours_per_day = {}
        for timesheet in timesheets:
            day = timesheet.start_time.date()
            hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
            if day in hours_per_day:
                hours_per_day[day] += hours_worked
            else:
                hours_per_day[day] = hours_worked

        #log_it(f"Fetched hours worked per day for manager {req.manager_id}")
        return hours_per_day
    except Exception as e:
        #log_error("Fetch hours worked per day error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getApprovedVsRecieved")
def get_approve_vs_recieved(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        manager_id = req.manager_id

        total_received = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id, TimesheetApproval.created_at >= req.start_time, TimesheetApproval.created_at <= req.end_time).count()

        total_approved = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id, TimesheetApproval.status == 2, TimesheetApproval.created_at >= req.start_time, TimesheetApproval.created_at <= req.end_time).count()

        total_rejected = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id, TimesheetApproval.status == 3, TimesheetApproval.created_at >= req.start_time, TimesheetApproval.created_at <= req.end_time).count()

        #log_it(f"Fetched approved vs received timesheets for manager {manager_id}")
        return {
            "total_received": total_received,
            "total_rejected": total_rejected,
            "total_approved": total_approved
        }
    except Exception as e:
        #log_error("Fetch approved vs received timesheets error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getTotalCompanyHrsVsTeamsHrs")
def get_company_vs_team(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        timesheets = db.query(Timesheet).filter(
            Timesheet.manager_id == req.manager_id,
            Timesheet.start_time >= req.start_time,
            Timesheet.end_time <= req.end_time,
            Timesheet.status == 2,
        ).all()

        company_timesheets = db.query(Timesheet).filter(
            Timesheet.start_time >= req.start_time,
            Timesheet.end_time <= req.end_time,
            Timesheet.status == 2,
        ).all()

        if not timesheets:
            #log_error("Fetch total company hours vs team hours failed", "Timesheets not found")
            raise HTTPException(status_code=404, detail="Timesheets not found")

        team_worked_hrs = 0
        for timesheet in timesheets:
            hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
            team_worked_hrs += hours_worked

        company_worked_hrs = 0
        for timesheet in company_timesheets:
            hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
            company_worked_hrs += hours_worked

        #log_it(f"Fetched total company hours vs team hours for manager {req.manager_id}")
        return {
            "team_worked_hrs": team_worked_hrs,
            "company_worked_hrs": company_worked_hrs
        }
    except Exception as e:
        #log_error("Fetch total company hours vs team hours error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
@app.post("/getLeave_today")
def get_leave_today(req: userBase, db: Session = Depends(get_db)):
    try:
        leaves_today = db.query(Leaves).filter(
            Leaves.manager_id == req.manager_id,
            Leaves.start_time >= req.start_time,
            Leaves.end_time <= req.end_time
        ).count()

        if not leaves_today:
            #log_error("Fetch leaves today failed", "Leaves not found")
            raise HTTPException(status_code=404, detail="Leaves not found")

        #log_it(f"Fetched leaves today for manager {req.manager_id}")
        return {"leaves_today": leaves_today}
    except Exception as e:
        #log_error("Fetch leaves today error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

def calculate_hours(start, end):
    start_dt = datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(end, "%Y-%m-%d %H:%M:%S")
    return (end_dt - start_dt).total_seconds() / 3600

@app.post("/getEmployeeTimesheetDataWithRole")
def get_employee_timesheet_role(req: userBase, current_user: Annotated[str, Depends(get_current_user)],db: Session = Depends(get_db)):
    try:
        join_data = db.execute(text("SELECT * FROM employee JOIN timesheet ON employee.empid = timesheet.employee_id WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 and timesheet.status=2 ORDER BY timesheet.start_time"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

        aggregated_data = {}
        for entry in join_data:
            day = entry.start_time.date()
            role = entry.role
            hours = (entry.end_time - entry.start_time).total_seconds() / 3600

            if day not in aggregated_data:
                aggregated_data[day] = {}  # Initialize the day key with an empty dictionary

            if role in aggregated_data[day]:
                aggregated_data[day][role] += hours
            else:
                aggregated_data[day][role] = hours

        #log_it(f"Fetched employee timesheet data with role for manager {req.manager_id}")
        return aggregated_data
    except Exception as e:
        #log_error("Fetch employee timesheet data with role error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/calculateHoursProject")
def calculate_hours_projects(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        project_hours = {}
        # timesheet_entries = db.query(Timesheet).filter(
        #     Timesheet.manager_id == req.manager_id,
        #     Timesheet.start_time >= req.start_time,
        #     Timesheet.end_time <= req.end_time,
        #     Timesheet.status == 2,
        # ).all()

        timesheet_entries = db.execute(text("SELECT * FROM timesheet join project on timesheet.project_id=project.project_id WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 and timesheet.status=2 ORDER BY timesheet.employee_id"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

    

        for entry in timesheet_entries:
            hours_worked = (entry.end_time - entry.start_time).total_seconds() / 3600
            project_name = entry.name.strip()
            if entry.project_id in project_hours:
                project_hours[entry.project_id] += hours_worked
            else:
                project_hours[entry.project_id] = hours_worked

        #log_it(f"Calculated hours worked per project for manager {req.manager_id}")
        return project_hours
    except Exception as e:
        #log_error("Calculate hours worked per project error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

# import bcrypt

@app.post("/getUserInfo")
async def ret_one(req: userBase, db: Session = Depends(get_db)):
    try:
        # hashedp = bcrypt.hashpw(req.password.encode('utf-8'), bcrypt.gensalt())
        authenticated_user = db.query(Employee).filter(Employee.empid == req.emp_id).first()

        if not authenticated_user:
            #log_error("Get user info failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        #log_it(f"Retrieved user info for employee {req.emp_id}")
        return {
            "emp_id": authenticated_user.empid,
            "manager_id": authenticated_user.manager_id,
            "is_manager": authenticated_user.ismanager
        }
    except Exception as e:
        #log_error("Get user info error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/addProjectData")
def add_project_data(req: projectAddBase, db: Session = Depends(get_db)):
    try:
        add_item = Project(**req.dict())
        print(req)

        if not add_item:
            #log_error("Add project data failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        db.add(add_item)
        db.commit()
        db.refresh(add_item)

        log_project()
        
        #log_it(f"Project data added for project {req.project_id}")
        return 1
    except Exception as e:
        #log_error("Add project data error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getProjectDataByManagerId")
async def get_manager_project(req: userBase, db: Session = Depends(get_db)):
    try:
        id = req.manager_id
        project_list = db.query(Project).filter(Project.manager_id == id).all()

        result_list = []
        for project in project_list:
            result_list.append({
                "name": project.name,
                "project_id": project.project_id,
                "description": project.description,
                "startTime": project.start_date,
                "deadline": project.deadline,
                "employeeCount": project.employee_count
            })

        #log_it(f"Fetched project data for manager {id}")
        return result_list
    except Exception as e:
        #log_error("Fetch project data by manager ID error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getEmployeeInfoByManger")
async def get_employee_by_manager(req: userBase, db: Session = Depends(get_db)):
    try:
        id = req.manager_id
        employee_list = db.query(Employee).filter(Employee.manager_id == id).all()

        if not employee_list:
            #log_error("Fetch employee info by manager failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        for employee in employee_list:
            result_list.append({
                "id": employee.empid,
                "name": employee.name,
                "role": employee.role,
            })

        #log_it(f"Fetched employee info for manager {id}")
        return result_list
    except Exception as e:
        #log_error("Fetch employee info by manager error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/addEmployeeProjects")
async def add_employee_projects(req: addProjectBase, db: Session = Depends(get_db)):
    try:
        add_item = EmployeeProjects(**req.dict())

        if not add_item:
            #log_error("Add employee projects failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        db.add(add_item)
        db.commit()
        db.refresh(add_item)
        
        #log_it(f"Employee project added for employee {req.employee_id} and project {req.project_id}")
        return 1
    except Exception as e:
        #log_error("Add employee projects error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getCommonEmployee")
async def get_common_employee(req: userBase, db: Session = Depends(get_db)):
    try:
        common_employees = db.execute(text("select distinct employee_id from employeeProjects where project_id in (select project_id from employeeProjects where employee_id= :user1) and employee_id!= :user2"), {'user1': req.emp_id, "user2": req.emp_id}).fetchall()

        if not common_employees:
            #log_error("Fetch common employees failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for employee in common_employees:
            result_list.append({
                "id": employee.employee_id
            })

        #log_it(f"Fetched common employees for employee {req.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Fetch common employees error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getProjectBySelectedEmployee")
async def get_project_selected_employee(req: commonProjectBase, db: Session = Depends(get_db)):
    try:
        common_projects = db.execute(text("select distinct project_id from employeeProjects where project_id in (select project_id from employeeProjects where employee_id= :user1) and employee_id= :user2"), {'user1': req.emp_id, "user2": req.co_emp_id}).fetchall()

        if not common_projects:
            #log_error("Fetch projects by selected employee failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        result_list = []
        for employee in common_projects:
            result_list.append({
                "project_id": employee.project_id
            })

        #log_it(f"Fetched projects for employee {req.emp_id} and co-employee {req.co_emp_id}")
        return result_list
    except Exception as e:
        #log_error("Fetch projects by selected employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


# 1 timesheet alert
# 2 leave alert
# 3 ticket alert
@app.post("/addAlert")
async def add_alert(req: addAlertBase, db: Session = Depends(get_db)):
    try:
        add_item = Alert(**req.dict())

        if not add_item:
            #log_error("Add alert failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        db.add(add_item)
        db.commit()
        db.refresh(add_item)
        
        #log_it(f"Alert added for employee {req.employee_id}")
        return 1
    except Exception as e:
        #log_error("Add alert error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/updateAlerts")
async def update_alerts(req: addAlertBase, db: Session = Depends(get_db)):
    try:
        alt_id = req.alt_id
        change_alert = db.query(Alert).filter(Alert.alt_id == alt_id).first()

        if not change_alert:
            #log_error("Update alert failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        change_alert.status = 1
        db.commit()

        #log_it(f"Alert {alt_id} updated to status 1")
        return 1
    except Exception as e:
        #log_error("Update alert error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getAlertByEmployee")
async def get_alert_by_employee(req: userBase, db: Session = Depends(get_db)):
    try:
        alert_list = db.query(Alert).filter(Alert.employee_id == req.emp_id, Alert.status == 0).all()

        if not alert_list:
            #log_error("Fetch alerts by employee failed", "Incorrect username or password")
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        for alert in alert_list:
            result_list.append({
                "alt_id": alert.alt_id,
                "description": alert.alt_description,
                "employee_id": alert.employee_id,
                "status": alert.status,
                "type": alert.alt_type
            })

        #log_it(f"Fetched alerts for employee {req.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Fetch alerts by employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")





# @app.post("/getEmployeeInfo")
# async def get_employee_info(req: userBase, db: Session = Depends(get_db)):
#     employee_list=db.query(Employee).filter(Employee.manager_id == req.manager_id).all()

#     if not employee_list:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
    
#     result_list = []
#     for employee in employee_list:
        
    
#     return result_list



# class EmployeeWithProjects(BaseModel):
#     employee: Employee
    

# @app.get("/employees/manager/{manager_id}", response_model=List[EmployeeWithProjects])
# def get_employees_with_projects(manager_id: int, db: Session = Depends(get_db)):
    
#     # Query to get employees with the specified manager_id
#     db.execute("SELECT * FROM employee WHERE manager_id = ?", (manager_id,))
#     employees = cursor.fetchall()

#     employee_projects = []

#     for emp in employees:
#         employee_id = emp['employee_id']
        
#         # Query to get projects for each employee
#         cursor.execute("SELECT project_id FROM employeeProject WHERE employee_id = ?", (employee_id,))
#         projects = cursor.fetchall()
#         project_ids = [proj['project_id'] for proj in projects]

#         employee_info = Employee(
#             employee_id=emp['employee_id'],
#             name=emp['name'],
#             email=emp['email'],
#             manager_id=emp['manager_id']
#         )

#         employee_projects.append(EmployeeWithProjects(employee=employee_info, projects=project_ids))

#     conn.close()
#     return employee_projects



@app.post("/pushTimesheetNotFilledAlert")
async def timesheet_not_filled_alert(req: userBase, db: Session = Depends(get_db)):
    try:
        timesheet_dates = db.execute(text("SELECT DISTINCT CONVERT(DATE, start_time) FROM timesheet WHERE timesheet.employee_id = :user_id and CONVERT(DATE,timesheet.start_time) < CONVERT(DATE, GETDATE())"), {'user_id': req.emp_id}).fetchall()

        cnt = 0
        current_date = date.today()
        print(current_date)

        for i in timesheet_dates:
            cnt += 1

        rem_days = current_date.day

        #log_it(f"Timesheet not filled alert calculated for employee {req.emp_id}")
        return {"rem_days": rem_days - cnt}
    except Exception as e:
        #log_error("Timesheet not filled alert error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getLatestApproveRequestForEmployee")
async def get_latest_approve_request_for_employee(req: userBase, db: Session = Depends(get_db)):
    try:
        latest_date = db.execute(text("select max(created_at) as mx_date from timesheetApproval where employee_id=:user_id and status=2"), {'user_id': req.emp_id}).first()

        if not latest_date:
            #log_it(f"No latest approval request found for employee {req.emp_id}")
            return {"latest_date": None}

        #log_it(f"Latest approval request date fetched for employee {req.emp_id}")
        return {"latest_date": latest_date.mx_date}
    except Exception as e:
        #log_error("Get latest approval request for employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/deleteSingleTimesheetEntry")
async def delete_single_entry(req: userBase, db: Session = Depends(get_db)):
    try:
        query = db.query(Timesheet).filter(
            Timesheet.timesheet_id == req.timesheet_id,
            Timesheet.employee_id == req.emp_id
        )

        items_to_delete = query.all()

        if items_to_delete:
            for item in items_to_delete:
                db.delete(item)
            db.commit()
            #log_it(f"Timesheet entry {req.timesheet_id} deleted for employee {req.emp_id}")
            return {"message": "Items deleted successfully"}
        else:
            #log_error("Delete single timesheet entry failed", "Timesheet entry not found")
            raise HTTPException(status_code=404, detail="Timesheet entry not found")
    except Exception as e:
        #log_error("Delete single timesheet entry error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getEmployeeInfo")
def get_employees_with_projects(req: userBase, db: Session = Depends(get_db)):
    try:
        manager_id = req.manager_id
        employees = db.query(Employee).filter(Employee.manager_id == manager_id).all()
        employee_projects = []
        timesheets = db.execute(text("SELECT * FROM timesheet WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 and timesheet.status=2 ORDER BY timesheet.employee_id"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()
        leaves = db.execute(text("SELECT * FROM leaves WHERE leaves.manager_id = :user_id and leaves.start_time>= :time1 and leaves.end_time<= :time2 and leaves.status=2 ORDER BY leaves.employee_id"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

        for emp in employees:
            projects = db.query(EmployeeProjects).filter(EmployeeProjects.employee_id == emp.empid).all()
            project_ids = [proj.project_id for proj in projects]

            total = 0
            for timesheet in timesheets:
                if timesheet.employee_id == emp.empid:
                    hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() // 3600
                    total += hours_worked

            leave_total = 0
            for leave in leaves:
                if leave.employee_id == emp.empid:
                    leave_total += (leave.end_time - leave.start_time).total_seconds() / (3600 * 24)

            employee_info = EmployeeRef(
                employee_id=emp.empid,
                name=emp.name,
                role=emp.role,
                manager_id=emp.manager_id,
                projects=project_ids,
                LoggedHrs=total,
                LeaveDays=leave_total
            )

            employee_projects.append(employee_info)

        #log_it(f"Fetched employee info with projects for manager {manager_id}")
        return employee_projects
    except Exception as e:
        #log_error("Get employee info with projects error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getProjectByEmployee")
async def get_employee_project(req: userBase, db: Session = Depends(get_db)):
    try:
        projects = db.execute(text("select name, a.project_id, b.employee_id from project a join employeeprojects b on a.project_id=b.project_id where employee_id= :user_id"), {'user_id': req.emp_id}).fetchall()

        result_list = []
        for project in projects:
            result_list.append({
                "project_id": project.project_id,
                "name": project.name,
            })

        #log_it(f"Fetched projects for employee {req.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get projects by employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/getEmployeeByProject")
async def get_project_employee(req: userBase, db: Session = Depends(get_db)):
    try:
        employees = db.execute(text("select name, b.employee_id, project_id from employee a join employeeprojects b on a.empid=b.employee_id where b.project_id= :project_id and b.employee_id!= :user_id"), {'project_id': req.project_id, 'user_id': req.emp_id}).fetchall()

        result_list = []
        for employee in employees:
            result_list.append({
                "employee_id": employee.employee_id,
                "name": employee.name,
            })

        #log_it(f"Fetched employees for project {req.project_id} excluding employee {req.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get employees by project error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.post("/getLeaveData")
async def get_leave_data(req: reqBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        leave_records = db.execute(text("SELECT start_time, end_time FROM leaves WHERE manager_id = :user_id and start_time>= :time1 and end_time<= :time2 and status=2"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

        leave_data = 0
        for record in leave_records:
            leave_days = (record.end_time - record.start_time).days
            leave_data += leave_days
        
        #log_it(f"Fetched leave data for manager {req.manager_id}")
        return {"leave_records": leave_data}
    except Exception as e:
        #log_error("Fetch leave data error", str(e))
        return 2

@app.post("/getTopPerformers")
async def get_top_performers(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        timesheet_entries = db.execute(text("SELECT start_time, end_time, b.name FROM timesheet a join employee b on a.employee_id=b.empid WHERE b.manager_id = :user_id and start_time>= :time1 and end_time<= :time2 and status=2"), {'user_id': req.manager_id, "time1": req.start_time, "time2": req.end_time}).fetchall()

        # Aggregate total time worked for each employee
        employee_times = {}
        for entry in timesheet_entries:
            time_diff = (entry.end_time - entry.start_time).total_seconds() / 3600  # Convert to hours
            if entry.name in employee_times:
                employee_times[entry.name] += time_diff
            else:
                employee_times[entry.name] = time_diff

        # Sort employees by total time worked in descending order and get the top three
        sorted_employees = sorted(employee_times.items(), key=lambda x: x[1], reverse=True)[:3]

        # Format the results
        result = [
            {"employee_name": employee[0], "total_hours": employee[1]}
            for employee in sorted_employees
        ]

        #log_it(f"Fetched top performers for manager {req.manager_id}")
        return result
    except Exception as e:
        #log_error("Fetch top performers error", str(e))
        return []


@app.post("/getLeaveTableByEmployee")
async def get_leave_table(req: userBase, db: Session = Depends(get_db)):
    try:
        leaves = db.query(typeOfLeave).filter(typeOfLeave.employee_id == req.emp_id).all()
        result_list = []
        for leave in leaves:
            result_list.append({
                "t_id": leave.t_id,
                "t_name": leave.t_name,
                "balance": leave.balance
            })

        #log_it(f"Fetched remaining leaves data for employee {req.emp_id}")
        return result_list
    except Exception as e:
        #log_error("Get remaining leaves data by employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error1")
    
@app.post("/getPendingTickets")
async def get_leave_table(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    try:
        leaves = db.query(Ticket).filter(Ticket.ref_employee_id == req.emp_id, Ticket.status == 0).all()
        result_list = []
        for leave in leaves:
            result_list.append({
                "ticket": 1
            })

        #log_it(f"Fetched remaining leaves data for employee {req.emp_id}")
        return len(result_list)
    except Exception as e:
        #log_error("Get remaining leaves data by employee error", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")