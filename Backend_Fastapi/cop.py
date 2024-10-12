from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship



Base = declarative_base()


class Employee(Base):
    __tablename__ = "employee"

    empid = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String)
    # Consider using a more secure password hashing mechanism
    password = Column(String)  # Placeholder for hashed password
    manager_id = Column(Integer)
    department_id = Column(Integer, ForeignKey("department.dep_id"))
    created_by = Column(Integer)
    created_date = Column(Date)
    modified_by = Column(Integer)
    modify_date = Column(Date)
    isactive = Column(Boolean)

    departments = relationship("Department", backref="Employee")



class Department(Base):
    __tablename__ = "department"

    dep_id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    created_by = Column(Integer)
    created_date = Column(Date)
    modified_by = Column(Integer)
    modify_date = Column(Date)
    isactive = Column(Boolean)

    employees = relationship("Employee", backref="Department")
    # Employees = relationship("Employee", backref="project")




# class Employee(Base):
#     __tablename__ = "employee"

#     empid = Column(Integer, primary_key=True)
#     name = Column(String)
#     role = Column(String)
#     # Consider using a more secure password hashing mechanism
#     password = Column(String)  # Placeholder for hashed password
#     manager_id = Column(Integer)
#     department_id = Column(Integer, ForeignKey("department.dep_id"))
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

#     # Relationships
#     timesheets = relationship("Timesheet", backref="employee")
#     leaves = relationship("Leaves", backref="employee")
#     tickets_created = relationship("Ticket", foreign_keys="Ticket.ref_employee_id",backref="employee")  # Tickets created by this employee
#     tickets_assigned = relationship("Ticket", foreign_keys="Ticket.ref_employee_id", backref="employee")  # Tickets assigned to this employee
#     projects = relationship("employeeProjects", backref="employees")

# class Project(Base):
#     __tablename__ = "project"

#     project_id = Column(Integer, primary_key=True)
#     description = Column(String)
#     start_date = Column(DateTime)
#     deadline = Column(DateTime)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

#     # Relationships
#     timesheets = relationship("Timesheet", backref="project")
#     tickets = relationship("Ticket", backref="project")
#     Employees = relationship("EmployeeProjects", backref="project")

# class Department(Base):
#     __tablename__ = "department"

#     dep_id = Column(Integer, primary_key=True)
#     name = Column(String)
#     description = Column(String)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

#     # Employees = relationship("Employee", backref="project")



# class Timesheet(Base):
#     __tablename__ = "timesheet"

#     timesheet_id = Column(Integer, primary_key=True)
#     start_time = Column(DateTime)
#     end_time = Column(DateTime)
#     task_name = Column(String)
#     project_id = Column(Integer, ForeignKey("project.project_id"))
#     employee_id = Column(Integer, ForeignKey("employee.empid"))
#     status = Column(Boolean)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

# class Holiday(Base):
#     __tablename__ = "holiday"

#     h_id= Column(Integer, primary_key=True)
#     start_date = Column(Date)
#     end_date = Column(Date)
#     occasion = Column(String)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

# class Leaves(Base):
#     __tablename__ = "leaves"

#     leave_id = Column(Integer, primary_key=True)
#     start_time = Column(DateTime)
#     end_time = Column(DateTime)
#     t_id = Column(Integer, ForeignKey("typeOfLeave.t_id"))
#     status = Column(Boolean)
#     reason = Column(String)
#     manager_id = Column(Integer, ForeignKey("employee.empid"))
#     employee_id = Column(Integer, ForeignKey("employee.empid"))
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

# class Ticket(Base):
#     __tablename__ = "tickets"

#     ticket_id = Column(Integer, primary_key=True)
#     create_at = Column(Date)
#     description = Column(String)
#     status = Column(Boolean)
#     creator_id = Column(Integer, ForeignKey("employee.empid"))
#     project_id = Column(Integer, ForeignKey("project.project_id"))
#     ref_employee_id = Column(Integer, ForeignKey("employee.empid"))
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

# class typeOfLeave(Base):
#     __tablename__ = "typeOfLeave"

#     t_id = Column(Integer, primary_key=True)
#     t_name = Column(String)
#     t_days = Column(Integer)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)

#     leaves = relationship("Leaves", backref="typeOfLeave")

# class EmployeeProjects(Base):
#     __tablename__ = "employeeProjects"

#     employee_id = Column(Integer, ForeignKey("employee.empid"), primary_key=True)
#     project_id = Column(Integer, ForeignKey("project.project_id"), primary_key=True)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#     isactive = Column(Boolean)