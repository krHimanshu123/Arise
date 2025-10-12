"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function TaskCard({ task }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-100"
        };
      case "running":
        return {
          icon: Loader2,
          color: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          bgColor: "bg-blue-100"
        };
      case "completed":
        return {
          icon: CheckCircle,
          color: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          bgColor: "bg-green-100"
        };
      case "failed":
        return {
          icon: AlertCircle,
          color: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          bgColor: "bg-red-100"
        };
      default:
        return {
          icon: Clock,
          color: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100"
        };
    }
  };

  const config = getStatusConfig(task.status);
  const Icon = config.icon;

  const formatActionName = (action) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatParams = (params) => {
    if (!params || typeof params !== 'object') return '';
    
    const entries = Object.entries(params);
    if (entries.length === 0) return '';
    
    return entries
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(', ');
  };

  const formatResult = (result) => {
    if (!result) return '';
    
    if (typeof result === 'string') {
      return result.length > 100 ? `${result.substring(0, 100)}...` : result;
    }
    
    if (result.error) {
      return `Error: ${result.error}`;
    }
    
    // For structured data, show key information
    if (typeof result === 'object') {
      const summary = [];
      if (result.name) summary.push(`Name: ${result.name}`);
      if (result.status) summary.push(`Status: ${result.status}`);
      if (result.message) summary.push(result.message);
      if (result.value !== undefined) summary.push(`Value: ${result.value}`);
      
      return summary.length > 0 ? summary.join(', ') : JSON.stringify(result).substring(0, 100);
    }
    
    return String(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        bg-gradient-to-r ${config.color} ${config.borderColor}
        p-4 shadow-lg
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={task.status === "running" ? { rotate: 360 } : {}}
            transition={task.status === "running" ? { 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            } : {}}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${config.bgColor} ${config.borderColor} border
            `}
          >
            <Icon className={`w-4 h-4 ${config.textColor}`} />
          </motion.div>
          
          <div>
            <h4 className="text-sm font-medium text-white">
              {formatActionName(task.action)}
            </h4>
            <p className="text-xs text-white/60">
              {new Date(task.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className={`
          px-2 py-1 rounded-full text-xs font-medium border
          ${config.bgColor} ${config.borderColor} ${config.textColor}
        `}>
          {task.status}
        </div>
      </div>

      {/* Parameters */}
      {task.params && Object.keys(task.params).length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/50 mb-1">Parameters:</p>
          <p className="text-xs text-white/80 bg-white/5 rounded-lg p-2 font-mono">
            {formatParams(task.params)}
          </p>
        </div>
      )}

      {/* Result */}
      {task.result && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.2 }}
          className="mt-3 pt-3 border-t border-white/10"
        >
          <p className="text-xs text-white/50 mb-1">Result:</p>
          <div className="text-xs text-white/90 bg-white/5 rounded-lg p-3">
            <pre className="whitespace-pre-wrap font-mono">
              {formatResult(task.result)}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Progress Bar for Running Tasks */}
      {task.status === "running" && (
        <div className="mt-3">
          <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>
      )}

      {/* Success Animation */}
      {task.status === "completed" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}

      {/* Error Animation */}
      {task.status === "failed" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}