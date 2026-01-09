"use client";
import { useState, useEffect } from 'react';
import EmployeeNode from './EmployeeNode';
import { departmentService } from '@/services/hr-services/departmentService';
import { toast } from 'sonner';

export default function OrganizationChart() {
  const [chartData, setChartData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [viewMode, setViewMode] = useState('hierarchical');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await departmentService.getOrgChart();
        if (response.success && response.data && response.data.length > 0) {
          const rootNode = response.data[0];
          setChartData(rootNode);
          // Auto-expand the root node if it exists
          if (rootNode.id) {
            setExpandedNodes(new Set([rootNode.id]));
          }
        }
      } catch (error) {
        console.error('Error fetching org chart:', error);
        toast.error('Failed to load organizational chart');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className="flex flex-col items-center">
        <EmployeeNode
          node={node}
          depth={depth}
          isExpanded={isExpanded}
          onToggle={() => toggleNode(node.id)}
        />

        {isExpanded && node.children && node.children.length > 0 && (
          <div className="flex justify-center space-x-4 md:space-x-8 mt-6">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chartData || (!chartData.name && !chartData.reports)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <p>No organizational data available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-4">
      <div className="inline-block min-w-full">
        {renderNode(chartData)}
      </div>
    </div>
  );
}