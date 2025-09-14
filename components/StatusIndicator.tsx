
import React from 'react';
import type { Status } from '../types';
import { StatusType } from '../types';

interface StatusIndicatorProps {
  status: Status;
}

const StatusIcon: React.FC<{ type: StatusType }> = ({ type }) => {
  switch (type) {
    case StatusType.SENDING:
      return (
        <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    case StatusType.SUCCESS:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case StatusType.ERROR:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1-4a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    case StatusType.IDLE:
    default:
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8.05 16h3.9a2 2 0 11-3.9 0z" />
            </svg>
        )
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getTextColor = () => {
    switch (status.type) {
      case StatusType.SUCCESS: return 'text-green-300';
      case StatusType.ERROR: return 'text-red-300';
      case StatusType.SENDING: return 'text-blue-300';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-center space-x-3 p-3 bg-black/20 rounded-lg">
      <StatusIcon type={status.type} />
      <p className={`text-sm ${getTextColor()}`}>{status.message}</p>
    </div>
  );
};
