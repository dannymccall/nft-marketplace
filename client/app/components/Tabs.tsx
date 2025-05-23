"use client";
import React, { JSX, useState } from "react";

interface Tab {
  label: string | JSX.Element; // Now can be a string or JSX (e.g., icon)
  content: JSX.Element | any;
}

interface TabComponentProps {
  tabs: Tab[];
  initialTab?: number; // Optional initial tab index
  className?: string; // Optional className prop
  shadow?: string
}

const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  initialTab = 0,
  className = "", // Default to an empty string if no className is provided
shadow= ''
}) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  return (
    <>
      <div className="w-full h-full flex-col justify-center z-50">
        {/* Tab Navigation */}
        <div className="w-full   rounded-lg">
          <div className={`flex justify-center mt-5 ${className} w-full`}>

            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`cursor-pointer   transition duration-300 ease-in-out ${
                  activeTab === index
                    ? "border-b-2 border-b-slate-100 text-slate-100 font-semibold text-sm"
                    : "text-gray-400"
                } `}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={` p-4 lg:w-4xl w-full ${shadow ?  shadow : ''} rounded-md flex-wrap ${className ? className : ""}`}>
            {tabs[activeTab].content}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabComponent;
