
import PlusIcon from '../icons/PlusIcon';
import { useState, useMemo } from 'react';
import type { Column, Id, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import { createPortal } from 'react-dom';
import { arrayMove } from "@dnd-kit/sortable";

function KanbanBoard() {
  const  [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks,setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })
);
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
      <DndContext sensors={sensors} onDragStart={ondragstart} onDragEnd={onDragEnd}>
        <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          <SortableContext items={columnsId}>{columns.map((col) => (<ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks = {tasks.filter(task => task.columnId === col.id)}/>))}</SortableContext>
          </div>
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
        { createPortal(<DragOverlay>
          {activeColumn && <ColumnContainer column={activeColumn} 
          deleteColumn={deleteColumn} 
          updateColumn={updateColumn}
          createTask={createTask}
          />}


        </DragOverlay>,
          document.body)}
      </DndContext>
    </div>
  );
  function createTask(columnId: Id) {
    const newTasak: Task = {
      id: generateID(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTasak]);
  }
  
  
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  
  }  
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map(col => {
      if (col.id !== id) return col;
        return {...col, title};
      });
    setColumns(newColumns);

  }
  function ondragstart(event: DragStartEvent) {
    console.log('Drag started:', event);
    if (event.active.data.current?.type === 'column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if(!over) return;

    const activeColumnID = active.id;
    const overColumnID = over.id;

    if (activeColumnID === overColumnID) return;

    setColumns(columns => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnID);
      const overColumnIndex = columns.findIndex((col) => col.id === overColumnID);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
  })
  }
function generateID() {
  return Math.floor(Math.random() * 10001);
}
}

export default KanbanBoard



