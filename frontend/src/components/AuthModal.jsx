import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Sparkles, AlertCircle, ShieldCheck, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialView = 'select', onLoginSuccess }) {
  if (!isOpen) return null;

  const { login, register, logout } = useAuth();

  // Mode: 'select' | 'member_login' | 'member_signup' | 'admin_login' | 'admin_signup'
  const [mode, setMode] = useState(initialView);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('admin123'); // Pre-filled default key for effortless viva evaluation

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setMode(initialView);
    setErrorMsg(null);
  }, [initialView, isOpen]);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAdminKey('admin123');
    setErrorMsg(null);
  };

  const handlePortalSelect = (targetMode) => {
    resetFields();
    setMode(targetMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'member_signup' || mode === 'admin_signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'admin_login') {
        const userData = await login(email, password);
        if (userData.role !== 'admin') {
          logout();
          throw new Error(`Access Denied: Account (${email}) is a Member. Please use the Member Portal.`);
        }
        if (onLoginSuccess) onLoginSuccess('/admin/dashboard');
      } else if (mode === 'admin_signup') {
        const userData = await register({ 
          name, 
          email, 
          password, 
          adminKey: adminKey || 'admin123'
        });
        if (userData.role !== 'admin') {
          logout();
          throw new Error('Failed to grant admin privileges. Invalid Admin Security Key.');
        }
        if (onLoginSuccess) onLoginSuccess('/admin/dashboard');
      } else if (mode === 'member_login') {
        const userData = await login(email, password);
        if (userData.role === 'admin') {
          if (onLoginSuccess) onLoginSuccess('/admin/dashboard');
        } else {
          if (onLoginSuccess) onLoginSuccess('/member/dashboard');
        }
      } else if (mode === 'member_signup') {
        await register({ name, email, password });
        if (onLoginSuccess) onLoginSuccess('/member/dashboard');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword, expectedRole) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const userData = await login(quickEmail, quickPassword);
      if (expectedRole === 'admin' && userData.role !== 'admin') {
        logout();
        throw new Error('This account does not have Admin privileges.');
      }
      if (userData.role === 'admin') {
        if (onLoginSuccess) onLoginSuccess('/admin/dashboard');
      } else {
        if (onLoginSuccess) onLoginSuccess('/member/dashboard');
      }
      onClose();
    } catch (err) {
      setErrorMsg(`Demo Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A3026]/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#CDD4B1] max-w-lg w-full p-6 sm:p-8 shadow-organic-lg relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2A3026] text-white font-serif font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-organic-sm">
            H
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2A3026]">
            {mode === 'select' && 'Select Portal Access'}
            {mode === 'member_login' && 'Member Portal Sign In'}
            {mode === 'member_signup' && 'Create Member Account'}
            {mode === 'admin_login' && 'Admin Control Center Sign In'}
            {mode === 'admin_signup' && 'Register Administrator Account'}
          </h2>
          <p className="text-xs text-[#62685B] mt-1">
            {mode === 'select' && 'Choose your designated portal to sign in or register.'}
            {mode === 'member_login' && 'Sign in with your registered member account to book desks.'}
            {mode === 'member_signup' && 'Register a new member account for instant desk bookings.'}
            {mode === 'admin_login' && 'Authorized administrative login for inventory and occupancy management.'}
            {mode === 'admin_signup' && 'Provision a new admin account with your workspace security key.'}
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-1 bg-[#FFF9E2] p-1 rounded-2xl border border-[#CDD4B1] mb-6 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => handlePortalSelect('select')}
            className={`flex-1 min-w-[70px] py-2 px-1 text-center rounded-xl transition-all ${
              mode === 'select' ? 'bg-[#2A3026] text-white shadow-organic-sm' : 'text-[#62685B] hover:text-[#2A3026]'
            }`}
          >
            Portals
          </button>
          <button
            type="button"
            onClick={() => handlePortalSelect('member_login')}
            className={`flex-1 min-w-[90px] py-2 px-1 text-center rounded-xl transition-all ${
              mode === 'member_login' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-[#62685B] hover:text-[#2A3026]'
            }`}
          >
            Member Login
          </button>
          <button
            type="button"
            onClick={() => handlePortalSelect('member_signup')}
            className={`flex-1 min-w-[90px] py-2 px-1 text-center rounded-xl transition-all ${
              mode === 'member_signup' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-[#62685B] hover:text-[#2A3026]'
            }`}
          >
            Member Sign Up
          </button>
          <button
            type="button"
            onClick={() => handlePortalSelect('admin_login')}
            className={`flex-1 min-w-[85px] py-2 px-1 text-center rounded-xl transition-all ${
              mode === 'admin_login' ? 'bg-[#2A3026] text-white shadow-organic-sm' : 'text-[#62685B] hover:text-[#2A3026]'
            }`}
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => handlePortalSelect('admin_signup')}
            className={`flex-1 min-w-[95px] py-2 px-1 text-center rounded-xl transition-all ${
              mode === 'admin_signup' ? 'bg-[#2A3026] text-white shadow-organic-sm' : 'text-[#62685B] hover:text-[#2A3026]'
            }`}
          >
            Admin Sign Up
          </button>
        </div>

        {/* Error Alert Display */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF5F5] border border-red-300 text-red-800 text-xs font-medium flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------- STEP 1: PORTAL SELECTION SCREEN ---------------- */}
        {mode === 'select' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Member Portal Selection Card */}
            <div className="p-5 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] hover:border-[#DCA278] transition-all duration-300 shadow-organic-sm group">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-[#2A3026] text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#62685B] block">
                      Member Portal
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#2A3026] group-hover:text-[#DCA278] transition-colors">
                      Member Workspace Access
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#62685B] mt-2 leading-relaxed">
                For community members, freelancers, and teams to explore desks, search availability, and manage reservations.
              </p>

              <div className="mt-4 pt-3 border-t border-[#CDD4B1]/50 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePortalSelect('member_login')}
                  className="flex-1 py-2.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-organic-sm transition"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handlePortalSelect('member_signup')}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#CDD4B1] hover:bg-[#FFF9E2] text-[#2A3026] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* Admin Control Center Selection Card */}
            <div className="p-5 rounded-2xl bg-[#2A3026] text-white border border-[#CDD4B1]/30 hover:border-[#DCA278] transition-all duration-300 shadow-organic-sm group">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-[#DCA278] text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#EBECCC] block">
                      Management Access
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#DCA278] transition-colors">
                      Admin Control Center
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#EBECCC] mt-2 leading-relaxed">
                For workspace operations managers to oversee desk inventory, modify status, inspect daily occupancy, and review bookings.
              </p>

              <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePortalSelect('admin_login')}
                  className="flex-1 py-2.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-organic-sm transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePortalSelect('admin_signup')}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
                >
                  <KeyRound className="w-4 h-4 text-[#DCA278]" />
                  <span>Admin Sign Up</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- FORM VIEWS ---------------- */}
        {mode !== 'select' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Demo Credential Quick Buttons Bar */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#DCA278] uppercase tracking-wider">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Demo Credentials</span>
                </span>
                <span className="text-[9px] text-[#62685B] bg-white px-2 py-0.5 rounded border border-[#CDD4B1]">
                  Viva Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('john@example.com', 'member123', 'member')}
                  className="px-3 py-2 rounded-xl bg-white border border-[#CDD4B1] hover:border-[#2A3026] text-left text-xs transition duration-200 group"
                >
                  <span className="block font-bold text-[#2A3026] group-hover:text-[#DCA278]">Demo Member</span>
                  <span className="text-[10px] text-[#62685B]">john@example.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@coworking.com', 'admin123', 'admin')}
                  className="px-3 py-2 rounded-xl bg-white border border-[#CDD4B1] hover:border-[#DCA278] text-left text-xs transition duration-200 group"
                >
                  <span className="block font-bold text-[#DCA278]">Demo Admin</span>
                  <span className="text-[10px] text-[#62685B]">admin@coworking.com</span>
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {(mode === 'member_signup' || mode === 'admin_signup') && (
                <div>
                  <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={mode === 'admin_signup' ? 'e.g. Lead Administrator' : 'e.g. Jane Doe'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all"
                    />
                    <User className="w-4 h-4 text-[#62685B] absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder={mode.startsWith('admin') ? 'admin@coworking.com' : 'member@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-[#62685B] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-[#62685B] absolute left-3.5 top-3" />
                </div>
              </div>

              {(mode === 'member_signup' || mode === 'admin_signup') && (
                <div>
                  <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-[#62685B] absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              {mode === 'admin_signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider">
                      Admin Security Passcode
                    </label>
                    <span className="text-[10px] text-[#DCA278] font-bold">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter Admin Passcode (admin123)"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCA278] bg-[#FFF9E2] text-[#2A3026] text-sm font-mono font-bold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all"
                    />
                    <KeyRound className="w-4 h-4 text-[#DCA278] absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[10px] text-[#62685B] mt-1">
                    🛡️ This security key verifies administrative authorization before assigning the Admin role.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-organic-sm hover:shadow-organic-md transition-all duration-300 transform hover:-translate-y-0.5 mt-2 ${
                  mode.startsWith('admin') ? 'bg-[#2A3026] hover:bg-[#353C30]' : 'bg-[#DCA278] hover:bg-[#C88D63]'
                }`}
              >
                {loading ? 'Processing...' : (
                  mode === 'admin_login' 
                    ? 'Sign In to Admin Control Center' 
                    : mode === 'admin_signup'
                    ? 'Register & Open Admin Control Center'
                    : mode === 'member_signup'
                    ? 'Create Member Account'
                    : 'Sign In to Member Portal'
                )}
              </button>

            </form>

            {/* Bottom Toggle Links */}
            <div className="pt-2 text-center text-xs text-[#62685B] space-y-1">
              {mode === 'member_login' && (
                <p>
                  Don't have a member account?{' '}
                  <button
                    onClick={() => handlePortalSelect('member_signup')}
                    className="font-bold text-[#DCA278] hover:underline"
                  >
                    Sign Up as Member
                  </button>
                </p>
              )}
              {mode === 'member_signup' && (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => handlePortalSelect('member_login')}
                    className="font-bold text-[#DCA278] hover:underline"
                  >
                    Member Sign In
                  </button>
                </p>
              )}
              {mode === 'admin_login' && (
                <p>
                  Need to register a new admin?{' '}
                  <button
                    onClick={() => handlePortalSelect('admin_signup')}
                    className="font-bold text-[#DCA278] hover:underline"
                  >
                    Admin Sign Up
                  </button>
                </p>
              )}
              {mode === 'admin_signup' && (
                <p>
                  Already registered as admin?{' '}
                  <button
                    onClick={() => handlePortalSelect('admin_login')}
                    className="font-bold text-[#DCA278] hover:underline"
                  >
                    Admin Sign In
                  </button>
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
