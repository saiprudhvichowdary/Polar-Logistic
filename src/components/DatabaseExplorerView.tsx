import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  FileCode2,
  Copy,
  Check,
  Layers,
  Key,
  Calendar,
  History,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api/client';

export const DatabaseExplorerView: React.FC = () => {
  const [schemaData, setSchemaData] = useState<{
    tables: Array<{ name: string; rows: number; description: string }>;
    initSql: string;
    seedSql: string;
  } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'initSql' | 'seedSql'>('tables');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getDatabaseSchema()
      .then(data => {
        setSchemaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load schema:', err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs" id="database-schema-module">
      {/* Top Banner */}
      <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#58A6FF]" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              PostgreSQL Relational Logistics Architecture
            </h3>
          </div>
          <p className="text-[#8B949E] text-xs mt-1">
            21 normalized relational tables with enforced Foreign Keys, Cascade behaviors, check constraints, immutable event audit logs, and status fields.
          </p>
        </div>

        {/* Sub-tabs switcher */}
        <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-sm border border-subtle">
          <button
            onClick={() => setActiveSubTab('tables')}
            className={`px-3 py-1.5 rounded-sm transition uppercase tracking-wider text-[11px] font-mono ${
              activeSubTab === 'tables'
                ? 'bg-[#21262d] text-white border border-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-white'
            }`}
          >
            21 Relational Tables
          </button>
          <button
            onClick={() => setActiveSubTab('initSql')}
            className={`px-3 py-1.5 rounded-sm transition uppercase tracking-wider text-[11px] font-mono ${
              activeSubTab === 'initSql'
                ? 'bg-[#21262d] text-white border border-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-white'
            }`}
          >
            init.sql (DDL)
          </button>
          <button
            onClick={() => setActiveSubTab('seedSql')}
            className={`px-3 py-1.5 rounded-sm transition uppercase tracking-wider text-[11px] font-mono ${
              activeSubTab === 'seedSql'
                ? 'bg-[#21262d] text-white border border-[#58A6FF] font-bold shadow-sm'
                : 'text-[#8B949E] hover:text-white'
            }`}
          >
            seed_demo.sql (Dataset)
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="p-12 text-center text-[#8B949E] font-mono">Loading relational schema specifications...</div>
      ) : activeSubTab === 'tables' ? (
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-subtle">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-[#58A6FF]" />
              Relational Tables Catalog ({schemaData?.tables.length || 21})
            </h4>
            <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">Enforced Foreign Keys &amp; Audit Logs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {schemaData?.tables.map(tbl => (
              <div key={tbl.name} className="p-3.5 rounded-sm bg-[#0d1117] border border-subtle hover:border-[#58A6FF]/40 transition">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[#58A6FF] text-xs">{tbl.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#161B22] text-[#8B949E] border border-subtle font-bold uppercase tracking-wider">
                    {tbl.rows} Records
                  </span>
                </div>
                <p className="text-[11px] text-[#8B949E] mt-1">{tbl.description}</p>
                <div className="mt-2.5 pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-[#8B949E]">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-[#DBAB09]" /> PK: id
                  </span>
                  <span>TIMESTAMPTZ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SQL Code View */
        <div className="bg-panel border border-subtle rounded-sm p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-subtle">
            <span className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
              <FileCode2 className="w-4 h-4 text-[#58A6FF]" />
              {activeSubTab === 'initSql' ? 'db/init.sql — Complete Relational DDL' : 'db/seed_demo.sql — Demo Scenario Seed Script'}
            </span>

            <button
              onClick={() => handleCopy(activeSubTab === 'initSql' ? (schemaData?.initSql || '') : (schemaData?.seedSql || ''))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#21262d] hover:bg-[#30363d] text-white text-xs uppercase tracking-wider transition border border-subtle"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-sm border border-subtle max-h-[500px] overflow-y-auto text-[11px] text-[#C9D1D9] font-mono leading-relaxed custom-scrollbar">
            <pre className="whitespace-pre-wrap">
              {activeSubTab === 'initSql' ? schemaData?.initSql : schemaData?.seedSql}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
