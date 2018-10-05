import React from 'react';

import Link from 'app/js/services/routing/Link';

const employeeMapper = ({id, pic, firstName, lastName, title}, index) => (
  <li className="table-view-cell media" key={`emp_${index}`}>
    <Link href={`#employees/${id}`}>
      <img className="media-object pull-left" src={`assets/pics/${pic}`} />
      <div className="media-body">
        {firstName} {lastName}
        <p>{title}</p>
      </div>
    </Link>
  </li>
);

const EmployeeListPage = ({ employees }) => (
  <ul className="table-view">
    {employees.map(employeeMapper)}
  </ul>
);

export default EmployeeListPage;
