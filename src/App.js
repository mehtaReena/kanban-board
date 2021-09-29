
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import './styles.css'
const data = [
  { id: uuid(), content: "Test Map Image" ,
     tag:"damage",
     color:"#2E2EFF",
   url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},

];

const columnsFromBackend = {
  [uuid()]: {
    name: "New",
    items: data
  },
  [uuid()]: {
    name: "Open",
    items: [ { id: uuid(), tag:"damage", content: "Phone missing" ,color:"#2E2EFF" },]
  },
  [uuid()]: {
    name: "Set Aside",
    items: [{ id: uuid(),  color:"#e75480" ,tag:"crew",content: "Fix the fence", url:"https://images.unsplash.com/photo-1617656698782-ecfc988b6891?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGZlbmNlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    { id: uuid(), content: "Test computer", color:"#e75480" ,tag:"crew", url :"https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGNvbXB1dGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
  ]
  },
  [uuid()]: {
    name: "Closed",
    items: [ { id: uuid(), tag:"general", content: "Jhnny", color:"#e75480" }]
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div style={{ display: "flex", width:"100vw", height: "100vh" , padding: "30px", backgroundColor:"#e6ecf1"}}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                fontSize:"15px",
                paddingLeft: "50px"
              }}
              key={columnId}
            > <div style={{display:"flex" , flexDirection:"row" , gap:"1rem", alignItems:"center" ,justifyContent:"center"}}>
              <div style={{marginLeft:"12px", fontSize:"18px" , fontWeight:"bolder"}}>{column.name}</div>
              <div style={{backgroundColor:"#C0C0C0" ,color:"white" , display:"flex",
                justifyContent:"center", borderRadius:"2px",
              padding:"2px",width:"18px", height:"18px", alignItems:"center"}}>{column.items.length}</div>
              </div>
              <div style={{ margin:7 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e6ecf1"
                            : "#e6ecf1",
                          padding:"4px",
                          width: "300px",
                          minHeight:"100px"
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: "5px",
                                      margin: "0 0 20px 0",
                                      minHeight: "50px",
                                      borderRadius:"7px",
                                      backgroundColor: snapshot.isDragging
                                        ? "white"
                                        : "white",
                                      color: "black",
                                      boxShadow: "2px 2px 4px rgba(128, 128, 128, 0.363)",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                      <div style={{backgroundColor:item.color , borderRadius:"2px",
                                      fontWeight:"bold" ,fontSize: "12px" ,
                                      width:"fit-content",padding:"5px",textTransform: "uppercase",color:"white"}}> {item.tag}</div>
                                     <div style={{marginTop:"2px" ,padding:"5px"} }>
                                    {item.content}
                                    </div>

                                    <div style={{width:"100%", height:"100%" , objectFit:"cover" ,
                                    margin:"auto", padding:"12px"}}>
                                      <img src={item.url} style={{width:"100%" , height:"100%" , objectFit:"cover"}}  alt=""></img>
                                      </div>
                                      <div>{new Date(Date.now()).toLocaleTimeString()}
                                      </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
