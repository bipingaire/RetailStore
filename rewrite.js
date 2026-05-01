const fs = require('fs');
const file = 'app/super-admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Settings to imports
if (!content.includes('Settings')) {
  content = content.replace('Bell, Plus', 'Bell, Plus, Settings');
}

// 2. Replace the layout from <div className="h-screen... down to {/* --- TABS CONTENT --- */}
const layoutStart = '<div className="h-screen bg-white text-gray-900 font-sans flex overflow-hidden">';
const layoutEnd = '{/* --- TABS CONTENT --- */}';
const layoutStartIdx = content.indexOf(layoutStart);
const layoutEndIdx = content.indexOf(layoutEnd) + layoutEnd.length;

if (layoutStartIdx !== -1 && layoutEndIdx !== -1) {
  const newLayout = `<div className="min-h-screen bg-gradient-to-br from-[#e4e7eb] via-[#fdf9e3] to-[#fceb9c] text-gray-900 font-sans overflow-auto">
      {/* Top Navigation */}
      <header className="flex items-center justify-between p-6 max-w-[1400px] mx-auto">
        <div className="border border-gray-400/30 bg-white/40 rounded-full px-6 py-2.5 backdrop-blur-md flex items-center gap-2 shadow-sm">
           <span className="font-light text-lg tracking-wide text-gray-900">Crextio</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-full border border-gray-400/30 p-1 shadow-sm">
          {[
            { id: 'products', label: 'Dashboard' },
            { id: 'tenants', label: 'People' },
            { id: 'pending', label: 'Hiring' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'website', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-5 py-2 rounded-full text-sm font-medium transition-all \${
                activeTab === tab.id ? 'bg-[#2a2d32] text-white shadow-md' : 'text-gray-700 hover:bg-white/50'
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
           <button onClick={handleLogout} className="hidden md:flex items-center gap-2 border border-gray-400/30 bg-white/40 rounded-full px-5 py-2 backdrop-blur-md hover:bg-white/60 transition-all text-sm font-medium text-gray-700 shadow-sm">
              <Settings size={16} /> Setting
           </button>
           <button className="w-10 h-10 rounded-full bg-white/40 border border-gray-400/30 backdrop-blur-md flex items-center justify-center hover:bg-white/60 transition-all text-gray-700 shadow-sm">
              <Bell size={18} />
           </button>
           <div className="w-10 h-10 rounded-full bg-white overflow-hidden shadow-sm flex items-center justify-center border border-gray-400/30">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Avatar" className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-8 pb-10">
        <h1 className="text-[3rem] font-light tracking-tight text-gray-900 mb-8 px-2">
          {activeTab === 'products' ? 'Welcome in, Nixtio' : 
           activeTab === 'pending' ? 'Pending Approvals' :
           activeTab === 'tenants' ? 'Tenant Network' :
           activeTab === 'revenue' ? 'Revenue Analytics' : 'System Settings'}
        </h1>
        
        <div className="space-y-8">`;
  content = content.substring(0, layoutStartIdx) + newLayout + content.substring(layoutEndIdx);
}

// 3. Update Pending Approvals (1st Image requirement)
content = content.replace('bg-white rounded-[1.5rem] border-none overflow-hidden shadow-sm p-2', 'bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 overflow-hidden shadow-lg p-6');
content = content.replace('bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed', 'bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-white/50 shadow-lg');
content = content.replace('bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-start gap-5', 'bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-lg flex items-start gap-6');
content = content.replace('px-4 py-2 bg-green-600 hover:bg-green-700 text-white', 'px-5 py-2.5 bg-[#2a2d32] hover:bg-black text-white');

// 4. Update Revenue Analytics (3rd Image requirement)
content = content.replace(
  'bg-blue-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden',
  'bg-[#2a2d32] rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden'
);
content = content.replace(/bg-white rounded-xl border border-gray-200/g, 'bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem]');

// 5. Update Tenant Network (4th Image requirement)
content = content.replace('bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm', 'bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 overflow-hidden shadow-lg p-6');
content = content.replace('border-b border-gray-200 flex justify-between items-center bg-gray-50', 'border-b border-gray-400/20 flex justify-between items-center bg-transparent');
content = content.replace('bg-white border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold', 'border-b border-gray-400/20 text-gray-500 uppercase text-[10px] font-bold tracking-wider');

// 6. Update Products (2nd Image style for forms/tables)
content = content.replace('bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5', 'bg-white/50 backdrop-blur-md border border-white/50 rounded-full pl-10 pr-4 py-2.5');
content = content.replace('bg-[#155d3a] hover:bg-[#10482c] text-white px-5 py-2.5 rounded-full', 'bg-[#2a2d32] hover:bg-black text-white px-6 py-2.5 rounded-full');

// 7. Remove the ending 2 divs
content = content.replace('</div>{/* end main content flex wrapper */}\n    </div> // end outer root div', '');
content = content.replace('</div>{/* end main content flex wrapper */}\n      </div>{/* end inner wrapper */}', '');
content = content.replace('</div>{/* end main content flex wrapper */}\r\n    </div> // end outer root div', '');
content = content.replace('</div>{/* end main content flex wrapper */}\r\n      </div>{/* end inner wrapper */} \r\n', '');

// Wait, I had changed the end divs in earlier edits: "</div> {/* end inner wrapper */}"
// Let's just fix the end of file manually by finding the last return statement block and cleaning it.
const lastModalIdx = content.lastIndexOf('{/* Edit Product Modal */}');
if (lastModalIdx !== -1) {
    let suffix = content.substring(lastModalIdx);
    suffix = suffix.replace(/<\/div>\s*\{\/\*\s*end main content flex wrapper\s*\*\/\}/, '');
    suffix = suffix.replace(/<\/div>\s*\{\/\*\s*end inner wrapper\s*\*\/\}/, '');
    suffix = suffix.replace(/<\/div>\s*\/\/\s*end outer root div/, '');
    content = content.substring(0, lastModalIdx) + suffix;
}


fs.writeFileSync(file, content);
console.log("Rewrite complete.");
