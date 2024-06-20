import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import './ToDo.css';

const ToDo = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [task, setTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('none');

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (task.trim()) {
            setTasks([...tasks, { id: uuidv4(), text: task.trim(), completed: false }]);
            setTask('');
        }
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const toggleTaskCompletion = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleSort = (tasks) => {
        if (sort === 'completed') {
            return tasks.sort((a, b) => a.completed - b.completed);
        }
        if (sort === 'pending') {
            return tasks.sort((a, b) => b.completed - a.completed);
        }
        return tasks;
    };

    const filteredTasks = handleSort(tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    }));

    return (
        <div className="todo-container">
            <h1 className="heading">To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={(e) => (e.key === 'Enter' ? addTask() : null)}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <div className="filter-sort-container">
                <div className="filter-buttons">
                    <label>Filter: </label>
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                    <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
                    <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
                </div>
                <div className="sort-buttons">
                    <label>Sort: </label>
                    <button onClick={() => setSort('none')} className={sort === 'none' ? 'active' : ''}>Unsorted</button>
                    <button onClick={() => setSort('completed')} className={sort === 'completed' ? 'active' : ''}>Sort by Completed</button>
                    <button onClick={() => setSort('pending')} className={sort === 'pending' ? 'active' : ''}>Sort by Pending</button>
                </div>
            </div>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        <span className={task.completed ? 'completed' : ''}>
                            {task.text}
                        </span>
                        <div className="task-icons">
                            <FaCheckCircle
                                className={`icon ${task.completed ? 'completed-icon' : ''}`}
                                onClick={() => toggleTaskCompletion(task.id)}
                            />
                            <FaTrash
                                className="icon remove-icon"
                                onClick={() => removeTask(task.id)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDo;
