// // src/app/(dashboard)/super-admin/dashboard/components/WelcomeWrap.js
// import React from "react";
// import Link from "next/link";

// const WelcomeWrap = ({ userName, systemAlerts, pendingTasks, avatarUrl }) => {
//   return (
//     <div className="card bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-sm border-0 overflow-hidden text-white">
//       <div className="card-body p-6">
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           <div className="mb-4 md:mb-0">
//             <h4 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h4>
//             <p className="opacity-90">
//               System Overview & Administration Dashboard
//             </p>
//           </div>
          
//           <div className="flex space-x-4">
//             <div className="text-center">
//               <div className="bg-white/20 rounded-lg px-4 py-2">
//                 <span className="block text-xl font-bold">{systemAlerts}</span>
//                 <span className="block text-sm">System Alerts</span>
//               </div>
//             </div>
            
//             <div className="text-center">
//               <div className="bg-white/20 rounded-lg px-4 py-2">
//                 <span className="block text-xl font-bold">{pendingTasks}</span>
//                 <span className="block text-sm">Pending Tasks</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-6 pt-4 border-t border-white/20">
//           <div className="flex flex-wrap gap-2">
//             <Link
//               href="/super-admin/roles-permissions"
//               className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
//             >
//               Manage Roles
//             </Link>
//             <Link
//               href="/super-admin/system-settings"
//               className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
//             >
//               System Settings
//             </Link>
//             <Link
//               href="/super-admin/audit-logs"
//               className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
//             >
//               View Audit Logs
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeWrap;


import React from "react";
import Link from "next/link";
import { Shield, Settings, FileText, Bell } from "lucide-react";

const WelcomeWrap = ({ userName, systemAlerts, pendingTasks }) => {
  // Current Date Formatter
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black shadow-2xl border border-gray-800">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        
        {/* Left: Greeting */}
        <div className="space-y-4 max-w-2xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-gray-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Operational
           </div>
           
           <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                 Welcome back, {userName}
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                 Here is your system overview for <span className="text-white font-medium">{today}</span>. 
                 You have <span className="text-indigo-400 font-bold">{pendingTasks} pending tasks</span> requiring attention.
              </p>
           </div>

           {/* Quick Actions */}
           <div className="flex flex-wrap gap-3 pt-2">
              <QuickAction href="/super-admin/roles-permissions" icon={Shield} label="Manage Roles" />
              <QuickAction href="/super-admin/system-settings" icon={Settings} label="Global Settings" />
              <QuickAction href="/super-admin/audit-logs" icon={FileText} label="Audit Logs" />
           </div>
        </div>

        {/* Right: Alerts Widget */}
        <div className="flex gap-4">
           <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px] text-center hover:bg-white/10 transition-colors cursor-default group">
              <div className="mb-2 flex justify-center text-amber-400 group-hover:scale-110 transition-transform">
                 <Bell size={24} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{systemAlerts}</div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">System Alerts</div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for buttons
const QuickAction = ({ href, icon: Icon, label }) => (
  <Link 
    href={href}
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 backdrop-blur-sm text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
  >
    <Icon size={16} className="text-indigo-300" />
    {label}
  </Link>
);

export default WelcomeWrap;
