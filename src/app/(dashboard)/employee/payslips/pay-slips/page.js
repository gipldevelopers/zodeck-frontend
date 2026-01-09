"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // correct ESM import

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
    monthlyCTC: "0.00",
    payCycle: "1 SEPTEMBER - 30 SEPTEMBER",
    location: "Gandhinagar",
    actualPayableDays: "30",
    totalWorkingDays: "30",
    daysPayable: "0.0",
    totalLopDays: "0.0",
    lopDays: "0.0",
    penaltyDays: "0.0",
    additionalDaysPayable: "0.0",
    totalDaysPayable: "0.0",
    totalEarnings: "0.00",
    totalStatutoryContributions: "0.00",
    totalDeductions: "0.00",
    netPayable: "0.00",
    netSalaryInWords: "Rupees zero and Zero Paise"
  };

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payslips", href: "/employee/payslips" },
  ];

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");

    let lastY = 40; // Track last table Y position

    // Header
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

      // Update lastY with the last table's Y
      lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : y + data.length * 10 + 20;
    };

    // Personal Details
    addTable("Personal Details", [
      ["Employee Name", payslipData.employeeName],
      ["Employee #", payslipData.employeeId],
      ["Date Joined", payslipData.dateJoined],
      ["Department", payslipData.department],
      ["Designation", payslipData.designation],
      ["Payment Mode", payslipData.paymentMode],
    ]);

    // Bank & Statutory Details
    addTable("Bank & Statutory Details", [
      ["Bank", payslipData.bankName],
      ["Bank IFSC", payslipData.bankIFSC],
      ["Bank Account", payslipData.bankAccount],
      ["PAN", payslipData.pan],
      ["UAN", payslipData.uan],
      ["Date of Birth", payslipData.dob],
    ]);

    // Salary Details
    addTable("Salary Details", [
      ["Monthly CTC", `₹${payslipData.monthlyCTC}`],
      ["Pay Cycle", payslipData.payCycle],
      ["Location", payslipData.location],
    ]);

    // Attendance Details
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

    // Summary
    addTable("Summary", [
      ["Total Earnings (A)", `₹${payslipData.totalEarnings}`],
      ["Total Statutory Contributions (B)", `₹${payslipData.totalStatutoryContributions}`],
      ["Total Deductions (C)", `₹${payslipData.totalDeductions}`],
      ["Net Payable (A-B-C)", `₹${payslipData.netPayable}`],
      ["Net Salary in Words", payslipData.netSalaryInWords],
    ]);

    // Notes
    doc.setFontSize(10);
    doc.text("Note: All amounts displayed in this payslip are in INR.", 40, lastY + 20);
    doc.text("*This is computer generated statement, does not require signature.", 40, lastY + 35);

    doc.save(`Payslip_${months[selectedMonth]}_${selectedYear}.pdf`);
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">


        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full md:w-40 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2025, 2024, 2023].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full md:w-40 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
      </div>

      {/* Payslip Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden p-6">
  {/* Header */}
  <div className="text-center mb-6 border-b pb-4">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{payslipData.companyName}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300">{payslipData.companyAddress}</p>
    <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">
      Payslip for {months[selectedMonth]} {selectedYear}
    </h3>
  </div>

  {/* Table Sections */}
  {[
    {
      title: "Personal Details",
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
      fields: {
        "Monthly CTC": `₹${payslipData.monthlyCTC}`,
        "Pay Cycle": payslipData.payCycle,
        "Location": payslipData.location
      }
    },
    {
      title: "Attendance Details",
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
      fields: {
        "Total Earnings (A)": `₹${payslipData.totalEarnings}`,
        "Total Statutory Contributions (B)": `₹${payslipData.totalStatutoryContributions}`,
        "Total Deductions (C)": `₹${payslipData.totalDeductions}`,
        "Net Payable (A-B-C)": `₹${payslipData.netPayable}`,
        "Net Salary in Words": payslipData.netSalaryInWords
      }
    }
  ].map((section) => (
    <div key={section.title} className="mb-6">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 border-b pb-1">{section.title}</h4>
      <table className="w-full table-auto border border-gray-200 dark:border-gray-700 text-sm">
        <tbody>
          {Object.entries(section.fields).map(([label, value], index) => (
            <tr key={label} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}>
              <td className="px-4 py-2 font-medium text-gray-500 dark:text-gray-400 w-1/3">{label}</td>
              <td className="px-4 py-2 text-gray-900 dark:text-white">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}

  {/* Notes */}
  <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
    <p>Note: All amounts displayed in this payslip are in INR.</p>
    <p>*This is computer generated statement, does not require signature.</p>
  </div>
</div>

    </div>
  );
}
