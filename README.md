# CPU Scheduling Algorithms Visualization

An interactive web-based visualization tool for understanding various CPU scheduling algorithms used in operating systems.



## 🚀 Features

- Interactive demonstrations of 5 major CPU scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Priority Scheduling
  - Round Robin

- Modern, responsive user interface with:
  - Dynamic particle background effects
  - Glassmorphism design elements
  - Smooth animations and transitions
  - Mobile-friendly layout

- Real-time visualization of:
  - Process execution sequence
  - Waiting time calculation
  - Turnaround time computation
  - Gantt chart representation

## 🛠️ Technologies Used

- HTML5
- CSS3 (with modern features like CSS Variables)
- JavaScript (ES6+)
- Libraries:
  - particles.js (for background effects)
  - AOS (Animate On Scroll)
  - Animate.css
  - jQuery
  - Bootstrap (for styling)

## 🎯 Purpose

This project aims to help students and educators understand CPU scheduling algorithms through interactive visualizations. Each algorithm implementation includes:

- Step-by-step process execution
- Visual representation of scheduling decisions
- Performance metrics calculation
- Comparative analysis capabilities

## 🚦 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CPU-scheduling.git
```

2. Navigate to the project directory:
```bash
cd CPU-scheduling
```

3. Open `index.html` in a modern web browser

No additional setup or installation is required as this is a client-side application.

## 📱 Usage

1. Select any scheduling algorithm from the navigation menu
2. Input process details:
   - Arrival time
   - Burst time
   - Priority (for Priority Scheduling)
   - Time quantum (for Round Robin)
3. Click "Start" to visualize the scheduling process
4. Observe the Gantt chart and calculated metrics
5. Use the "Reset" button to try different scenarios

## 💡 Algorithms Implemented

### First Come First Serve (FCFS)
- Non-preemptive scheduling
- Processes are executed in arrival order
- Simple but may lead to convoy effect

### Shortest Job First (SJF)
- Non-preemptive scheduling
- Selects process with shortest burst time
- Optimal for minimizing average waiting time

### Shortest Remaining Time First (SRTF)
- Preemptive version of SJF
- Switches to shorter processes that arrive
- Optimal for minimizing average turnaround time

### Priority Scheduling
- Processes scheduled based on priority
- Can be preemptive or non-preemptive
- May lead to starvation

### Round Robin
- Time-sharing system
- Each process gets fixed time quantum
- Fair allocation but higher context switching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Inspired by operating systems concepts and algorithms
- UI design inspired by modern web design trends
- Special thanks to all contributors and feedback providers




---
⭐ Star this repository if you find it helpful!
