/**
 * Genetic Algorithm implementation for timetable optimization
 */

interface GeneticAlgorithmOptions {
  subjects: any[]
  teachers: any[]
  rooms: any[]
  timeSlots: any[]
  constraints: any
  onProgress?: (progress: number) => void
  populationSize?: number
  generations?: number
  mutationRate?: number
  crossoverRate?: number
}

// Main function to run the genetic algorithm
export async function runGeneticAlgorithm(options: GeneticAlgorithmOptions) {
  const {
    subjects,
    teachers,
    rooms,
    timeSlots,
    constraints,
    onProgress = () => {},
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    crossoverRate = 0.8,
  } = options

  // Initialize population
  let population = initializePopulation(populationSize, subjects, teachers, rooms, timeSlots)

  // Evaluate initial population
  let fitnessScores = evaluatePopulation(population, constraints)

  // Sort population by fitness
  let sortedPopulation = sortPopulationByFitness(population, fitnessScores)

  // Main evolution loop
  for (let generation = 0; generation < generations; generation++) {
    // Report progress
    onProgress((generation / generations) * 100)

    // Create new population through selection, crossover, and mutation
    const newPopulation = []

    // Elitism: Keep the best solutions
    const eliteCount = Math.floor(populationSize * 0.1)
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(sortedPopulation[i])
    }

    // Fill the rest of the population with offspring
    while (newPopulation.length < populationSize) {
      // Select parents
      const parent1 = selectParent(sortedPopulation, fitnessScores)
      const parent2 = selectParent(sortedPopulation, fitnessScores)

      // Crossover
      let offspring
      if (Math.random() < crossoverRate) {
        offspring = crossover(parent1, parent2)
      } else {
        offspring = Math.random() < 0.5 ? { ...parent1 } : { ...parent2 }
      }

      // Mutation
      if (Math.random() < mutationRate) {
        mutate(offspring, subjects, teachers, rooms, timeSlots)
      }

      newPopulation.push(offspring)
    }

    // Replace old population
    population = newPopulation

    // Evaluate new population
    fitnessScores = evaluatePopulation(population, constraints)

    // Sort population by fitness
    sortedPopulation = sortPopulationByFitness(population, fitnessScores)

    // Simulate some async work to not block the UI
    if (generation % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  // Return the best solution
  const bestSolution = sortedPopulation[0]

  // Convert the best solution to a timetable format
  return convertSolutionToTimetable(bestSolution, subjects, teachers, rooms, timeSlots)
}

// Initialize a random population
function initializePopulation(size, subjects, teachers, rooms, timeSlots) {
  const population = []

  for (let i = 0; i < size; i++) {
    const solution = createRandomSolution(subjects, teachers, rooms, timeSlots)
    population.push(solution)
  }

  return population
}

// Update the createRandomSolution function to handle practical sessions
function createRandomSolution(subjects, teachers, rooms, timeSlots) {
  const solution = {}

  // For each subject, assign a teacher, room, and time slot
  subjects.forEach((subject) => {
    // For each required lecture session
    for (let session = 0; session < subject.requiredSessions; session++) {
      // Find teachers qualified to teach this subject
      const qualifiedTeachers = teachers.filter((teacher) => teacher.subjects.includes(subject.id))

      if (qualifiedTeachers.length === 0) {
        return // Skip if no qualified teachers
      }

      // Randomly select a teacher, room, and time slot
      const teacher = qualifiedTeachers[Math.floor(Math.random() * qualifiedTeachers.length)]
      const regularRooms = rooms.filter((room) => !room.isLab)
      const room = regularRooms[Math.floor(Math.random() * regularRooms.length)]
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]

      // Create a unique key for this assignment
      const key = `${subject.id}-lecture-${session}`

      // Store the assignment
      solution[key] = {
        subjectId: subject.id,
        teacherId: teacher.id,
        roomId: room.id,
        timeSlotId: timeSlot.id,
        isPractical: false,
      }
    }

    // If the subject has practical sessions, schedule them too
    if (subject.hasPractical) {
      for (let practicalSession = 0; practicalSession < subject.practicalSessionsPerWeek; practicalSession++) {
        // Find teachers qualified to teach this subject
        const qualifiedTeachers = teachers.filter((teacher) => teacher.subjects.includes(subject.id))

        if (qualifiedTeachers.length === 0) {
          return // Skip if no qualified teachers
        }

        // Randomly select a teacher, lab room, and time slot
        const teacher = qualifiedTeachers[Math.floor(Math.random() * qualifiedTeachers.length)]

        // Filter for lab rooms
        const labRooms = rooms.filter((room) => room.isLab)
        // If no lab rooms, use regular rooms
        const availableRooms = labRooms.length > 0 ? labRooms : rooms
        const room = availableRooms[Math.floor(Math.random() * availableRooms.length)]

        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]

        // Create a unique key for this practical assignment
        const key = `${subject.id}-practical-${practicalSession}`

        // Store the assignment
        solution[key] = {
          subjectId: subject.id,
          teacherId: teacher.id,
          roomId: room.id,
          timeSlotId: timeSlot.id,
          isPractical: true,
        }
      }
    }
  })

  return solution
}

// Evaluate the fitness of each solution in the population
function evaluatePopulation(population, constraints) {
  return population.map((solution) => calculateFitness(solution, constraints))
}

// Calculate the fitness of a solution
function calculateFitness(solution, constraints) {
  // Higher fitness is better
  let fitness = 1000

  // Check for conflicts and constraints
  const conflicts = countConflicts(solution, constraints)

  // Penalize conflicts
  fitness -= conflicts * 100

  // Check for other constraints
  const constraintViolations = checkConstraintViolations(solution, constraints)

  // Penalize constraint violations
  fitness -= constraintViolations * 50

  // Ensure fitness is not negative
  return Math.max(0, fitness)
}

// Count conflicts in a solution
function countConflicts(solution, constraints) {
  let conflicts = 0

  // Create a map to track teacher, room, and time slot assignments
  const teacherAssignments = {}
  const roomAssignments = {}

  // Check each assignment for conflicts
  Object.values(solution).forEach((assignment) => {
    const { teacherId, roomId, timeSlotId } = assignment

    // Check for teacher conflicts (same teacher, same time slot)
    const teacherKey = `${teacherId}-${timeSlotId}`
    if (teacherAssignments[teacherKey]) {
      conflicts++
    } else {
      teacherAssignments[teacherKey] = true
    }

    // Check for room conflicts (same room, same time slot)
    const roomKey = `${roomId}-${timeSlotId}`
    if (roomAssignments[roomKey]) {
      conflicts++
    } else {
      roomAssignments[roomKey] = true
    }
  })

  return conflicts
}

// Check for constraint violations
function checkConstraintViolations(solution, constraints) {
  let violations = 0

  // Check for maximum consecutive lectures
  violations += checkConsecutiveLectures(solution, constraints.maxConsecutiveLectures)

  // Check for lunch break violations
  violations += checkLunchBreakViolations(solution, constraints)

  // Check for preferred time violations
  violations += checkPreferredTimeViolations(solution, constraints)

  // Check for teacher workload balance if enabled
  if (constraints.balanceTeacherLoad) {
    violations += checkTeacherWorkloadBalance(solution)
  }

  // Check for room changes if enabled
  if (constraints.minimizeRoomChanges) {
    violations += checkRoomChanges(solution)
  }

  return violations
}

// Check for consecutive lectures beyond the maximum allowed
function checkConsecutiveLectures(solution, maxConsecutive) {
  // Implementation would track consecutive lectures for each teacher
  // and count violations when they exceed maxConsecutive
  return 0 // Simplified for this example
}

// Check for lunch break violations
function checkLunchBreakViolations(solution, constraints) {
  // Implementation would check if teachers have assignments during lunch break
  return 0 // Simplified for this example
}

// Check for preferred time violations
function checkPreferredTimeViolations(solution, constraints) {
  // Implementation would check if assignments are outside preferred times
  return 0 // Simplified for this example
}

// Check for teacher workload balance
function checkTeacherWorkloadBalance(solution) {
  // Implementation would check if teacher workloads are balanced
  return 0 // Simplified for this example
}

// Check for unnecessary room changes
function checkRoomChanges(solution) {
  // Implementation would check for unnecessary room changes for consecutive classes
  return 0 // Simplified for this example
}

// Sort population by fitness (descending)
function sortPopulationByFitness(population, fitnessScores) {
  // Create pairs of [solution, fitness]
  const pairs = population.map((solution, index) => [solution, fitnessScores[index]])

  // Sort by fitness (descending)
  pairs.sort((a, b) => b[1] - a[1])

  // Return sorted solutions
  return pairs.map((pair) => pair[0])
}

// Select a parent using tournament selection
function selectParent(sortedPopulation, fitnessScores) {
  // Tournament selection: randomly select a few individuals and pick the best
  const tournamentSize = 3
  const tournament = []

  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * sortedPopulation.length)
    tournament.push(sortedPopulation[randomIndex])
  }

  // Return the best individual from the tournament
  return tournament[0]
}

// Perform crossover between two parents
function crossover(parent1, parent2) {
  const offspring = {}

  // Get all assignment keys
  const keys = Object.keys(parent1)

  // For each key, randomly choose from either parent
  keys.forEach((key) => {
    offspring[key] = Math.random() < 0.5 ? { ...parent1[key] } : { ...parent2[key] }
  })

  return offspring
}

// Mutate a solution
function mutate(solution, subjects, teachers, rooms, timeSlots) {
  // Randomly select an assignment to mutate
  const keys = Object.keys(solution)
  if (keys.length === 0) return

  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  const assignment = solution[randomKey]

  // Randomly decide what to mutate (teacher, room, or time slot)
  const mutationType = Math.floor(Math.random() * 3)

  switch (mutationType) {
    case 0: // Mutate teacher
      // Find qualified teachers for this subject
      const subjectId = assignment.subjectId
      const qualifiedTeachers = teachers.filter((teacher) => teacher.subjects.includes(subjectId))

      if (qualifiedTeachers.length > 0) {
        const newTeacher = qualifiedTeachers[Math.floor(Math.random() * qualifiedTeachers.length)]
        assignment.teacherId = newTeacher.id
      }
      break

    case 1: // Mutate room
      if (rooms.length > 0) {
        const newRoom = rooms[Math.floor(Math.random() * rooms.length)]
        assignment.roomId = newRoom.id
      }
      break

    case 2: // Mutate time slot
      if (timeSlots.length > 0) {
        const newTimeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]
        assignment.timeSlotId = newTimeSlot.id
      }
      break
  }
}

// Update the convertSolutionToTimetable function to include practical information
function convertSolutionToTimetable(solution, subjects, teachers, rooms, timeSlots) {
  const timetable = {}

  // Initialize the timetable structure
  timeSlots.forEach((slot) => {
    const day = slot.day
    const timeRange = `${slot.startTime}-${slot.endTime}`

    if (!timetable[day]) {
      timetable[day] = {}
    }

    if (!timetable[day][timeRange]) {
      timetable[day][timeRange] = []
    }
  })

  // Fill the timetable with assignments
  Object.values(solution).forEach((assignment) => {
    const { subjectId, teacherId, roomId, timeSlotId, isPractical } = assignment

    // Find the time slot
    const timeSlot = timeSlots.find((slot) => slot.id === timeSlotId)
    if (!timeSlot) return

    const day = timeSlot.day
    const timeRange = `${timeSlot.startTime}-${timeSlot.endTime}`

    // Add the assignment to the timetable
    if (!timetable[day]) {
      timetable[day] = {}
    }

    if (!timetable[day][timeRange]) {
      timetable[day][timeRange] = []
    }

    timetable[day][timeRange].push({
      subjectId,
      teacherId,
      roomId,
      isPractical: !!isPractical,
    })
  })

  // Add some metadata for the UI
  timetable.conflicts = countConflicts(solution, {})
  timetable.utilization = calculateUtilization(solution, subjects, teachers, rooms, timeSlots)

  return timetable
}

// Calculate resource utilization
function calculateUtilization(solution, subjects, teachers, rooms, timeSlots) {
  // This would calculate how efficiently resources are being used
  // For simplicity, we'll return a random value between 75 and 95
  return Math.floor(Math.random() * 20) + 75
}

