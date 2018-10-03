import React from 'react';
import HomePage from 'app/js/pages/HomePage';
import EmployeePage from 'app/js/pages/EmployeePage';
import ErrorPage from 'app/js/pages/ErrorPage';
import Layout from 'app/js/pages/TransitioningPageLayout';
import EmployeeService from 'app/js/services/memory/EmployeeService';

const service = new EmployeeService();

const routes = {
  path: '',
  async action({ next }) {
    const page = await next();

    if (typeof page !== 'undefined') {
      return (
        <Layout>
          {page.component}
        </Layout>
      );
    }
  },
  children: [
    {path: '/', action(context) {
      return {context, component: <HomePage service={service} />}
    }},
    {path: '/task', action(context) {
      return {context, component: <TaskList />}
    }},
    {path: '/employees/:id', async action(context) {
      const {params:{id}} = context;
      const employee = yield service.findById(parseInt(id));
      return {context, component: <EmployeePage employee={employee} />}
    }},
    {path: '/error', action(context) {
      const {error:{code}} = context;
      return {context, component: <ErrorPage status={code} />}
    }},
  ]
};

export default routes;
