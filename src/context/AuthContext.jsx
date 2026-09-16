import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../api/client';
import { ApiError } from '../api/errorHandler';
import { adminAuthService } from '../services/auth/adminAuthService';
import { expertAuthService } from '../services/auth/expertAuthService';
import { userAuthService } from '../services/auth/userAuthService';
import { clearToken, getTokenRecord, setToken } from '../utils/tokenManager';

export const AuthContext = createContext(null);

const createSession = () => ({
  account: null,
  isAuthenticated: false,
  isLoading: true,
  tokenType: null,
  emailVerified: null,
  kycStatus: null,
  restoreError: null,
});

const INITIAL_SESSIONS = Object.freeze({
  user: createSession(),
  expert: createSession(),
  admin: createSession(),
});

function requireData(payload, accountKey, requiresToken = false) {
  if (!payload || payload.status === false || !payload.data || typeof payload.data !== 'object') {
    throw new ApiError(payload?.message || 'Unexpected authentication response.', {
      status: 200,
      payload,
      code: 'CONTRACT_ERROR',
    });
  }

  if (!payload.data[accountKey]) {
    throw new ApiError('Authentication response is missing account data.', {
      status: 200,
      payload,
      code: 'CONTRACT_ERROR',
    });
  }

  if (requiresToken && !payload.data.token) {
    throw new ApiError('Authentication response is missing the bearer token.', {
      status: 200,
      payload,
      code: 'CONTRACT_ERROR',
    });
  }

  return payload.data;
}

export function AuthProvider({ children }) {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const updateSession = useCallback((accountType, patch) => {
    setSessions((current) => ({
      ...current,
      [accountType]: { ...current[accountType], ...patch },
    }));
  }, []);

  const clearSession = useCallback((accountType) => {
    clearToken(accountType);
    updateSession(accountType, {
      account: null,
      isAuthenticated: false,
      tokenType: null,
      emailVerified: null,
      kycStatus: null,
      restoreError: null,
      isLoading: false,
    });
  }, [updateSession]);

  useEffect(() => setUnauthorizedHandler((accountType) => {
    if (accountType === 'user' || accountType === 'expert' || accountType === 'admin') {
      clearSession(accountType);
    }
  }), [clearSession]);

  const restoreSession = useCallback(async (accountType) => {
    const tokenRecord = getTokenRecord(accountType);
    if (!tokenRecord) {
      updateSession(accountType, { isLoading: false, restoreError: null });
      return;
    }

    updateSession(accountType, { isLoading: true, restoreError: null, tokenType: tokenRecord.tokenType });

    try {
      if (accountType === 'user') {
        const payload = await userAuthService.me();
        const data = requireData(payload, 'user');
        updateSession('user', {
          account: data.user,
          isAuthenticated: true,
          isLoading: false,
          tokenType: tokenRecord.tokenType,
          restoreError: null,
        });
        return;
      }

      if (accountType === 'expert') {
        const payload = await expertAuthService.me();
        const data = requireData(payload, 'expert');
        updateSession('expert', {
          account: data.expert,
          isAuthenticated: true,
          isLoading: false,
          tokenType: tokenRecord.tokenType,
          emailVerified: data.email_verified,
          kycStatus: data.kyc_status,
          restoreError: null,
        });
        return;
      }

      const payload = await adminAuthService.me();
      const data = requireData(payload, 'admin');
      updateSession('admin', {
        account: data.admin,
        isAuthenticated: true,
        isLoading: false,
        tokenType: tokenRecord.tokenType,
        restoreError: null,
      });
    } catch (error) {
      if (error?.status === 401) {
        clearToken(accountType);
      }
      updateSession(accountType, {
        account: null,
        isAuthenticated: false,
        isLoading: false,
        restoreError: error,
      });
    }
  }, [updateSession]);

  useEffect(() => {
    restoreSession('user');
    restoreSession('expert');
    restoreSession('admin');
  }, [restoreSession]);

  const registerUser = useCallback(async (formData, remember = false) => {
    const payload = await userAuthService.register(formData);
    const data = requireData(payload, 'user', true);
    setToken('user', data.token, data.token_type, remember);
    updateSession('user', {
      account: data.user,
      isAuthenticated: true,
      isLoading: false,
      tokenType: data.token_type,
      restoreError: null,
    });
    return payload;
  }, [updateSession]);

  const loginUser = useCallback(async (credentials, remember = false) => {
    const payload = await userAuthService.login(credentials);
    const data = requireData(payload, 'user', true);
    setToken('user', data.token, data.token_type, remember);
    updateSession('user', {
      account: data.user,
      isAuthenticated: true,
      isLoading: false,
      tokenType: data.token_type,
      restoreError: null,
    });
    return payload;
  }, [updateSession]);

  const registerExpert = useCallback(async (formData, remember = false) => {
    const payload = await expertAuthService.register(formData);
    const data = requireData(payload, 'expert', true);
    setToken('expert', data.token, data.token_type, remember);
    updateSession('expert', {
      account: data.expert,
      isAuthenticated: true,
      isLoading: false,
      tokenType: data.token_type,
      emailVerified: data.email_verified,
      kycStatus: data.kyc_status,
      restoreError: null,
    });
    return payload;
  }, [updateSession]);

  const loginExpert = useCallback(async (credentials, remember = false) => {
    const payload = await expertAuthService.login(credentials);
    const data = requireData(payload, 'expert', true);
    setToken('expert', data.token, data.token_type, remember);
    updateSession('expert', {
      account: data.expert,
      isAuthenticated: true,
      isLoading: false,
      tokenType: data.token_type,
      emailVerified: data.email_verified,
      kycStatus: data.kyc_status,
      restoreError: null,
    });
    return payload;
  }, [updateSession]);

  const loginAdmin = useCallback(async (credentials, remember = false) => {
    const payload = await adminAuthService.login(credentials);
    const data = requireData(payload, 'admin', true);
    setToken('admin', data.token, data.token_type, remember);
    updateSession('admin', {
      account: data.admin,
      isAuthenticated: true,
      isLoading: false,
      tokenType: data.token_type,
      restoreError: null,
    });
    return payload;
  }, [updateSession]);

  const logout = useCallback(async (accountType, allDevices = false) => {
    const services = {
      user: userAuthService,
      expert: expertAuthService,
      admin: adminAuthService,
    };
    const service = services[accountType];
    if (!service) throw new Error(`Unsupported account type: ${accountType}`);

    try {
      return await (allDevices ? service.logoutAll() : service.logout());
    } finally {
      clearSession(accountType);
    }
  }, [clearSession]);


  const logoutAll = useCallback((accountType) => logout(accountType, true), [logout]);

  const changeExpertPassword = useCallback((data) => expertAuthService.changePassword(data), []);

  const resetUserPassword = useCallback(async (data) => {
    const payload = await userAuthService.resetPassword(data);
    clearSession('user');
    return payload;
  }, [clearSession]);

  const resetExpertPassword = useCallback(async (data) => {
    const payload = await expertAuthService.resetPassword(data);
    clearSession('expert');
    return payload;
  }, [clearSession]);

  const resendUserVerification = useCallback(async () => {
    const payload = await userAuthService.sendVerification();
    if (payload?.data && Object.prototype.hasOwnProperty.call(payload.data, 'email_verified')) {
      updateSession('user', { emailVerified: payload.data.email_verified });
    }
    return payload;
  }, [updateSession]);

  const verifyUserEmail = useCallback(async (id, hash, rawQuery) => {
    const payload = await userAuthService.verifyEmail(id, hash, rawQuery);
    if (payload?.data && Object.prototype.hasOwnProperty.call(payload.data, 'email_verified')) {
      updateSession('user', { emailVerified: payload.data.email_verified });
    }
    return payload;
  }, [updateSession]);

  const resendExpertVerification = useCallback(async () => {
    const payload = await expertAuthService.sendVerification();
    if (payload?.data && Object.prototype.hasOwnProperty.call(payload.data, 'email_verified')) {
      updateSession('expert', { emailVerified: payload.data.email_verified });
    }
    return payload;
  }, [updateSession]);

  const verifyExpertEmail = useCallback(async (id, hash, rawQuery) => {
    const payload = await expertAuthService.verifyEmail(id, hash, rawQuery);
    if (payload?.data && Object.prototype.hasOwnProperty.call(payload.data, 'email_verified')) {
      updateSession('expert', { emailVerified: payload.data.email_verified });
    }
    return payload;
  }, [updateSession]);

  const value = useMemo(() => ({
    sessions,
    registerUser,
    loginUser,
    registerExpert,
    loginExpert,
    loginAdmin,
    logout,
    logoutAll,
    restoreSession,
    clearSession,
    resetUserPassword,
    resetExpertPassword,
    resendUserVerification,
    resendExpertVerification,
    verifyUserEmail,
    verifyExpertEmail,
    forgotUserPassword: userAuthService.forgotPassword,
    forgotExpertPassword: expertAuthService.forgotPassword,
    changeExpertPassword,
  }), [
    sessions,
    registerUser,
    loginUser,
    registerExpert,
    loginExpert,
    loginAdmin,
    logout,
    logoutAll,
    restoreSession,
    clearSession,
    resetUserPassword,
    resetExpertPassword,
    resendUserVerification,
    resendExpertVerification,
    verifyUserEmail,
    verifyExpertEmail,
    changeExpertPassword,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
