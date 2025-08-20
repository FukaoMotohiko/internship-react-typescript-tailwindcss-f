
import PlusIcon from '../icons/PlusIcon';
import { useState } from 'react';
import type { Column } from '../types';
import ColumnContainer from './ColumnContainer';

function KanbanBoard() {
  const  [columns, setColumns] = useState<Column[]>([]);
  return (
    <div className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    justify-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    "
    >
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">{columns.map((col) => (<ColumnContainer column={col} />))}</div>
          <button onClick={() => {createNewColumn();} }
              className="
                h-[60px]
                w-[350px]
                min-w-[350px]
                cursor-pointer
                rounded-lg
                bg-mainBackgroundColor
                border-2
                border-columnBackgroundColor
                p-4
                ring-rose-500
                hover:ring-2
                flex
                gap-2
              ">
              <PlusIcon />

              Add column
            </button>
      </div>
    </div>
  );
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }
  function generateID() {
    return Math.floor(Math.random() * 10001);
  }  
}
  

export default KanbanBoard