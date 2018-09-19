import React from 'react';

const employeeMapper = ({id, pic, firstName, lastName, title}, index) => (
  <li className="table-view-cell media" key={`emp_${index}`}>
    <a href={`#employees/${id}`}>
      <img className="media-object pull-left" src={`assets/pics/${pic}`} />
      <div className="media-body">
        {firstName} {lastName}
        <p>{title}</p>
      </div>
    </a>
  </li>
);

const EmployeeListView = ({ employees }) => (
  <ul className="table-view">
    {employees.map(employeeMapper)}
  </ul>
);

export default EmployeeListView;
