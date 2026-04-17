import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import DriversList from '../pages/drivers/DriversList';
import DriverDetails from '../pages/drivers/DriverDetails';
import AddDriver from '../pages/drivers/AddDriver';
import EditDriver from '../pages/drivers/EditDriver';
import CompaniesList from '../pages/companies/CompaniesList';
import AddCompany from '../pages/companies/AddCompany';
import EditCompany from '../pages/companies/EditCompany';
import AdsList from '../pages/ads/AdsList';
import CreateAd from '../pages/ads/CreateAd';
import EditAd from '../pages/ads/EditAd';
import AreasList from '../pages/areas/AreasList';
import CreateArea from '../pages/areas/CreateArea';
import EditArea from '../pages/areas/EditArea';
import Reports from '../pages/reports/Reports';
import AuditLogs from '../pages/reports/AuditLogs';
import Profile from '../pages/auth/Profile';
import Settings from '../pages/auth/Settings';
import SetupAdmin from '../pages/SetupAdmin';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/setup-admin" element={<SetupAdmin />} />

            {/* Admin Routes */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                
                {/* Drivers */}
                <Route path="drivers" element={<DriversList />} />
                <Route path="drivers/new" element={<AddDriver />} />
                <Route path="drivers/:id" element={<DriverDetails />} />
                <Route path="drivers/edit/:id" element={<EditDriver />} />

                {/* Companies */}
                <Route path="companies" element={<CompaniesList />} />
                <Route path="companies/new" element={<AddCompany />} />
                <Route path="companies/edit/:id" element={<EditCompany />} />

                {/* Ads */}
                <Route path="ads" element={<AdsList />} />
                <Route path="ads/new" element={<CreateAd />} />
                <Route path="ads/edit/:id" element={<EditAd />} />

                {/* Areas */}
                <Route path="areas" element={<AreasList />} />
                <Route path="areas/new" element={<CreateArea />} />
                <Route path="areas/edit/:id" element={<EditArea />} />

                {/* Reports & Audit */}
                <Route path="reports" element={<Reports />} />
                <Route path="audit-logs" element={<AuditLogs />} />

                {/* User Info */}
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
