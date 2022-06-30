import React from "react";
import styles from "./taskHeader.module.css";

const TaskHeader = ({ tasks }) => {
  return (
    <div data-testid="task-header" className={styles.taskHeader}>
      <h1>Todo List</h1>

      <small>
        You have <b data-testid="header-remaining-task">{1}</b> of{" "}
        <b data-testid="header-total-task">{tasks.length}</b> tasks remaining
      </small>
    </div>
  );
};

export default TaskHeader;
