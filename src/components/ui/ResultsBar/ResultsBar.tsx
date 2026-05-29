'use client';

import { useEffect, useState } from 'react';

type ResultsBarProps = {
  percent: number;
};

export function ResultsBar({ percent }: ResultsBarProps) {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(true);
      setWidth(percent);
    }, 50);
    return () => clearTimeout(id);
  }, [percent]);

  return (
    <div className={`w-full mt-2 px-1 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-sm font-semibold text-gray-700 mt-1 text-center">{percent}%</p>
    </div>
  );
}
