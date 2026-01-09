import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-blue-800">HRMS Portal</div>
        <div className="flex gap-4">
          <Link href="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Streamline Your Human Resources
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Manage employees, leave requests, and HR processes all in one place. 
          Our HRMS platform makes human resource management simple and efficient.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/signin" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/about" 
            className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Learn More
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-blue-600 font-bold">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Employee Dashboard</h3>
            <p className="text-gray-600">
              Employees can easily request leave, view their status, and manage their profile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-green-600 font-bold">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">HR Management</h3>
            <p className="text-gray-600">
              HR professionals can manage all employees, approve requests, and generate reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-purple-600 font-bold">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast & Secure</h3>
            <p className="text-gray-600">
              Built with modern technology to ensure speed, security, and reliability.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 text-center text-gray-600">
        <p>© 2024 HRMS Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}