import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import DriversList from '../pages/drivers/DriversList';
import DriverDetails from '../pages/drivers/DriverDetails';
import AddDriver from '../pages/drivers/AddDriver';
import CompaniesList from '../pages/companies/CompaniesList';
import AddCompany from '../pages/companies/AddCompany';
import AdsList from '../pages/ads/AdsList';
import CreateAd from '../pages/ads/CreateAd';
import AreasList from '../pages/areas/AreasList';
import CreateArea from '../pages/areas/CreateArea';
import Reports from '../pages/reports/Reports';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                
                {/* Drivers */}
                <Route path="drivers" element={<DriversList />} />
                <Route path="drivers/new" element={<AddDriver />} />
                <Route path="drivers/:id" element={<DriverDetails />} />

                {/* Companies */}
                <Route path="companies" element={<CompaniesList />} />
                <Route path="companies/new" element={<AddCompany />} />

                {/* Ads */}
                <Route path="ads" element={<AdsList />} />
                <Route path="ads/new" element={<CreateAd />} />

                {/* Areas */}
                <Route path="areas" element={<AreasList />} />
                <Route path="areas/new" element={<CreateArea />} />

                {/* Reports */}
                <Route path="reports" element={<Reports />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
