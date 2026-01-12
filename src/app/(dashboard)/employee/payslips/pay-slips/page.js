"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Download, Calendar, FileText, Building2, User, CreditCard, Banknote } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function PayslipsPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const payslipData = {
    companyName: "Gohil Infotech Private Limited",
    companyAddress: "407, 4th floor, Sharan Circle Hub, Gandhinagar, Gujarat 382421",
    period: "September 2024",
    employeeName: "Brian Roystoun Dsouza",
    employeeId: "057",
    dateJoined: "07 Oct 2024",
    department: "Default Department",
    designation: "Software Engineer",
    paymentMode: "NEFT",
    bankName: "HDFC BANK LTD",
    bankIFSC: "HDFC0000570",
    bankAccount: "50100644623068",
    pan: "EUZPD8875D",
    uan: "-",
    dob: "10 Jul 2000",
    monthlyCTC: "45,000.00",
    payCycle: "1 SEPTEMBER - 30 SEPTEMBER",
    location: "Gandhinagar",
    actualPayableDays: "30",
    totalWorkingDays: "30",
    daysPayable: "30.0",
    totalLopDays: "0.0",
    lopDays: "0.0",
    penaltyDays: "0.0",
    additionalDaysPayable: "0.0",
    totalDaysPayable: "30.0",
    totalEarnings: "45,000.00",
    totalStatutoryContributions: "2,000.00",
    totalDeductions: "3,500.00",
    netPayable: "39,500.00",
    netSalaryInWords: "Rupees Thirty Nine Thousand Five Hundred and Zero Paise"
  };

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payslips", href: "/employee/payslips" },
    { label: "Pay Slips", href: "/employee/payslips/pay-slips" },
  ];

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");

    let lastY = 40;

    doc.setFontSize(18);
    doc.text(payslipData.companyName, 40, lastY);
    doc.setFontSize(12);
    doc.text(payslipData.companyAddress, 40, lastY + 20);
    doc.setFontSize(16);
    doc.text(`Payslip for ${months[selectedMonth]} ${selectedYear}`, 40, lastY + 40);

    lastY += 60;

    const addTable = (title, data, startY = null) => {
      const y = startY !== null ? startY : lastY + 20;
      doc.setFontSize(14);
      doc.text(title, 40, y - 10);

      autoTable(doc, {
        startY: y,
        head: [["Field", "Value"]],
        body: data,
        theme: "grid",
        styles: { fontSize: 11 },
      });

      lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : y + data.length * 10 + 20;
    };

    addTable("Personal Details", [
      ["Employee Name", payslipData.employeeName],
      ["Employee #", payslipData.employeeId],
      ["Date Joined", payslipData.dateJoined],
      ["Department", payslipData.department],
      ["Designation", payslipData.designation],
      ["Payment Mode", payslipData.paymentMode],
    ]);

    addTable("Bank & Statutory Details", [
      ["Bank", payslipData.bankName],
      ["Bank IFSC", payslipData.bankIFSC],
      ["Bank Account", payslipData.bankAccount],
      ["PAN", payslipData.pan],
      ["UAN", payslipData.uan],
      ["Date of Birth", payslipData.dob],
    ]);

    addTable("Salary Details", [
      ["Monthly CTC", `₹${payslipData.monthlyCTC}`],
      ["Pay Cycle", payslipData.payCycle],
      ["Location", payslipData.location],
    ]);

    addTable("Attendance Details", [
      ["Actual Payable Days", payslipData.actualPayableDays],
      ["Total Working Days", payslipData.totalWorkingDays],
      ["Days Payable", payslipData.daysPayable],
      ["Total Loss of Pay Days", payslipData.totalLopDays],
      ["Loss of Pay Days", payslipData.lopDays],
      ["Penalty Days", payslipData.penaltyDays],
      ["Additional Days Payable", payslipData.additionalDaysPayable],
      ["Total Days Payable", payslipData.totalDaysPayable],
    ]);

    addTable("Summary", [
      ["Total Earnings (A)", `₹${payslipData.totalEarnings}`],
      ["Total Statutory Contributions (B)", `₹${payslipData.totalStatutoryContributions}`],
      ["Total Deductions (C)", `₹${payslipData.totalDeductions}`],
      ["Net Payable (A-B-C)", `₹${payslipData.netPayable}`],
      ["Net Salary in Words", payslipData.netSalaryInWords],
    ]);

    doc.setFontSize(10);
    doc.text("Note: All amounts displayed in this payslip are in INR.", 40, lastY + 20);
    doc.text("*This is computer generated statement, does not require signature.", 40, lastY + 35);

    doc.save(`Payslip_${months[selectedMonth]}_${selectedYear}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pay Slips</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View and download your payslips</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full sm:w-40 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[2025, 2024, 2023].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full sm:w-40 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Payslip Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gray-700 dark:to-gray-800 px-6 py-6 border-b border-primary-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{payslipData.companyName}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-9">{payslipData.companyAddress}</p>
            <div className="flex items-center gap-2 mt-4 ml-9">
              <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payslip for {months[selectedMonth]} {selectedYear}
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Table Sections */}
            {[
              {
                title: "Personal Details",
                icon: User,
                fields: {
                  "Employee Name": payslipData.employeeName,
                  "Employee #": payslipData.employeeId,
                  "Date Joined": payslipData.dateJoined,
                  "Department": payslipData.department,
                  "Designation": payslipData.designation,
                  "Payment Mode": payslipData.paymentMode
                }
              },
              {
                title: "Bank & Statutory Details",
                icon: CreditCard,
                fields: {
                  "Bank": payslipData.bankName,
                  "Bank IFSC": payslipData.bankIFSC,
                  "Bank Account": payslipData.bankAccount,
                  "PAN": payslipData.pan,
                  "UAN": payslipData.uan,
                  "Date of Birth": payslipData.dob
                }
              },
              {
                title: "Salary Details",
                icon: Banknote,
                fields: {
                  "Monthly CTC": `₹${payslipData.monthlyCTC}`,
                  "Pay Cycle": payslipData.payCycle,
                  "Location": payslipData.location
                }
              },
              {
                title: "Attendance Details",
                icon: Calendar,
                fields: {
                  "Actual Payable Days": payslipData.actualPayableDays,
                  "Total Working Days": payslipData.totalWorkingDays,
                  "Days Payable": payslipData.daysPayable,
                  "Total Loss of Pay Days": payslipData.totalLopDays,
                  "Loss of Pay Days": payslipData.lopDays,
                  "Penalty Days": payslipData.penaltyDays,
                  "Additional Days Payable": payslipData.additionalDaysPayable,
                  "Total Days Payable": payslipData.totalDaysPayable
                }
              },
              {
                title: "Summary",
                icon: FileText,
                fields: {
                  "Total Earnings (A)": `₹${payslipData.totalEarnings}`,
                  "Total Statutory Contributions (B)": `₹${payslipData.totalStatutoryContributions}`,
                  "Total Deductions (C)": `₹${payslipData.totalDeductions}`,
                  "Net Payable (A-B-C)": `₹${payslipData.netPayable}`,
                  "Net Salary in Words": payslipData.netSalaryInWords
                }
              }
            ].map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-primary-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      {section.title}
                    </h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(section.fields).map(([label, value], index) => (
                      <div key={label} className={`px-4 py-3 ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700/50"}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
                          <span className="text-sm text-gray-900 dark:text-white font-medium">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Notes */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">Note: All amounts displayed in this payslip are in INR.</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">*This is computer generated statement, does not require signature.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
