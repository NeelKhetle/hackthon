$(document).ready(() => {
  // Input form handling
  $("#subject-form").on("submit", (e) => {
    e.preventDefault()
    const subjectData = {
      code: $("#subject-code").val(),
      name: $("#subject-name").val(),
      department: $("#subject-department").val(),
      credits: Number.parseInt($("#subject-credits").val()),
      requiredSessions: Number.parseInt($("#subject-sessions").val()),
      hasPractical: $("#subject-has-practical").is(":checked"),
      practicalDuration: Number.parseInt($("#practical-duration").val()),
      practicalSessionsPerWeek: Number.parseInt($("#practical-sessions").val()),
    }

    $.ajax({
      url: "/api/add_subject",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(subjectData),
      success: (response) => {
        alert("Subject added successfully")
        $("#subject-form")[0].reset()
        updateSubjectCount()
      },
      error: (xhr, status, error) => {
        alert("Error adding subject: " + error)
      },
    })
  })

  $("#teacher-form").on("submit", (e) => {
    e.preventDefault()
    const teacherData = {
      id: $("#teacher-id").val(),
      name: $("#teacher-name").val(),
      department: $("#teacher-department").val(),
      maxHoursPerDay: Number.parseInt($("#teacher-max-hours").val()),
      subjects: $("#teacher-subjects input:checked")
        .map(function () {
          return this.value
        })
        .get(),
    }

    $.ajax({
      url: "/api/add_teacher",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(teacherData),
      success: (response) => {
        alert("Teacher added successfully")
        $("#teacher-form")[0].reset()
        updateTeacherCount()
      },
      error: (xhr, status, error) => {
        alert("Error adding teacher: " + error)
      },
    })
  })

  $("#room-form").on("submit", (e) => {
    e.preventDefault()
    const roomData = {
      id: $("#room-id").val(),
      name: $("#room-name").val(),
      capacity: Number.parseInt($("#room-capacity").val()),
      hasProjector: $("#room-has-projector").is(":checked"),
      hasComputers: $("#room-has-computers").is(":checked"),
      isLab: $("#room-is-lab").is(":checked"),
      labType: $("#room-is-lab").is(":checked") ? $("#lab-type").val() : "",
    }

    $.ajax({
      url: "/api/add_room",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(roomData),
      success: (response) => {
        alert("Room added successfully")
        $("#room-form")[0].reset()
        updateRoomCount()
      },
      error: (xhr, status, error) => {
        alert("Error adding room: " + error)
      },
    })
  })

  $("#timeslot-form").on("submit", (e) => {
    e.preventDefault()
    const timeSlotData = {
      day: $("#timeslot-day").val(),
      startTime: $("#timeslot-start").val(),
      endTime: $("#timeslot-end").val(),
    }

    $.ajax({
      url: "/api/add_time_slot",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(timeSlotData),
      success: (response) => {
        alert("Time slot added successfully")
        $("#timeslot-form")[0].reset()
      },
      error: (xhr, status, error) => {
        alert("Error adding time slot: " + error)
      },
    })
  })

  // Batch input handling
  $("#import-subjects").on("click", () => {
    const csvData = $("#subjects-csv").val()
    const subjects = parseCSV(csvData)

    subjects.forEach((subject) => {
      $.ajax({
        url: "/api/add_subject",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(subject),
        success: (response) => {
          console.log("Subject added:", subject.name)
        },
        error: (xhr, status, error) => {
          console.error("Error adding subject:", subject.name, error)
        },
      })
    })

    alert("Subjects imported successfully")
    $("#subjects-csv").val("")
    updateSubjectCount()
  })

  $("#import-teachers").on("click", () => {
    const csvData = $("#teachers-csv").val()
    const teachers = parseCSV(csvData)

    teachers.forEach((teacher) => {
      $.ajax({
        url: "/api/add_teacher",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(teacher),
        success: (response) => {
          console.log("Teacher added:", teacher.name)
        },
        error: (xhr, status, error) => {
          console.error("Error adding teacher:", teacher.name, error)
        },
      })
    })

    alert("Teachers imported successfully")
    $("#teachers-csv").val("")
    updateTeacherCount()
  })

  $("#import-rooms").on("click", () => {
    const csvData = $("#rooms-csv").val()
    const rooms = parseCSV(csvData)

    rooms.forEach((room) => {
      $.ajax({
        url: "/api/add_room",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(room),
        success: (response) => {
          console.log("Room added:", room.name)
        },
        error: (xhr, status, error) => {
          console.error("Error adding room:", room.name, error)
        },
      })
    })

    alert("Rooms imported successfully")
    $("#rooms-csv").val("")
    updateRoomCount()
  })

  $("#import-timeslots").on("click", () => {
    const csvData = $("#timeslots-csv").val()
    const timeSlots = parseCSV(csvData)

    timeSlots.forEach((timeSlot) => {
      $.ajax({
        url: "/api/add_time_slot",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(timeSlot),
        success: (response) => {
          console.log("Time slot added:", timeSlot.day, timeSlot.startTime, timeSlot.endTime)
        },
        error: (xhr, status, error) => {
          console.error("Error adding time slot:", timeSlot.day, timeSlot.startTime, timeSlot.endTime, error)
        },
      })
    })

    alert("Time slots imported successfully")
    $("#timeslots-csv").val("")
  })

  // Timetable generation
  $("#generate-timetable").on("click", () => {
    $.ajax({
      url: "/api/generate_timetable",
      method: "POST",
      success: (response) => {
        alert("Timetable generated successfully")
        $("#timetable-stats").removeClass("d-none")
        $("#export-buttons").removeClass("d-none")
        updateTimetableView()
      },
      error: (xhr, status, error) => {
        alert("Error generating timetable: " + error)
      },
    })
  })

  // Timetable view handling
  $("#view-type").on("change", function () {
    const viewType = $(this).val()
    if (viewType === "master") {
      $("#entity-select").addClass("d-none")
    } else {
      $("#entity-select").removeClass("d-none")
      populateEntitySelect(viewType)
    }
    updateTimetableView()
  })

  $("#entity").on("change", () => {
    updateTimetableView()
  })

  // Export handling
  $("#export-pdf").on("click", () => {
    window.location.href = "/api/export_pdf"
  })

  $("#export-csv").on("click", () => {
    window.location.href = "/api/export_csv"
  })

  // Helper functions
  function parseCSV(csv) {
    const lines = csv.split("\n")
    const result = []
    const headers = lines[0].split(",")

    for (let i = 1; i < lines.length; i++) {
      const obj = {}
      const currentLine = lines[i].split(",")

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentLine[j].trim()
      }

      result.push(obj)
    }

    return result
  }

  function updateSubjectCount() {
    $.get("/api/subject_count", (data) => {
      $("#subject-count").text(data.count)
    })
  }

  function updateTeacherCount() {
    $.get("/api/teacher_count", (data) => {
      $("#teacher-count").text(data.count)
    })
  }

  function updateRoomCount() {
    $.get("/api/room_count", (data) => {
      $("#room-count").text(data.count)
    })
  }

  function populateEntitySelect(viewType) {
    $("#entity").empty()
    if (viewType === "teacher") {
      $.get("/api/teachers", (data) => {
        data.forEach((teacher) => {
          $("#entity").append(
            $("<option>", {
              value: teacher.id,
              text: teacher.name,
            }),
          )
        })
      })
    } else if (viewType === "room") {
      $.get("/api/rooms", (data) => {
        data.forEach((room) => {
          $("#entity").append(
            $("<option>", {
              value: room.id,
              text: room.name,
            }),
          )
        })
      })
    }
  }

  function updateTimetableView() {
    const viewType = $("#view-type").val()
    const entityId = $("#entity").val()

    $.get("/api/timetable", { viewType: viewType, entityId: entityId }, (data) => {
      renderTimetable(data)
    })
  }

  function renderTimetable(timetableData) {
    const container = $("#timetable-container")
    container.empty()

    const table = $("<table>").addClass("table table-bordered")
    const thead = $("<thead>")
    const tbody = $("<tbody>")

    // Create header row
    const headerRow = $("<tr>")
    headerRow.append($("<th>").text("Time / Day"))
    timetableData.days.forEach((day) => {
      headerRow.append($("<th>").text(day))
    })
    thead.append(headerRow)

    // Create rows for each time slot
    timetableData.timeSlots.forEach((timeSlot) => {
      const row = $("<tr>")
      row.append($("<td>").text(timeSlot))

      timetableData.days.forEach((day) => {
        const cell = $("<td>").addClass("timetable-cell")
        const sessions = timetableData.schedule[day][timeSlot] || []

        sessions.forEach((session) => {
          const sessionDiv = $("<div>").addClass("session")
          sessionDiv.addClass(session.isPractical ? "session-practical" : "session-lecture")

          sessionDiv.append($("<div>").addClass("session-subject").text(session.subject))
          sessionDiv.append($("<div>").addClass("session-teacher").text(session.teacher))
          sessionDiv.append($("<div>").addClass("session-room").text(session.room))

          if (session.isPractical) {
            sessionDiv.append($("<div>").addClass("session-type").text("LAB"))
          }

          cell.append(sessionDiv)
        })

        row.append(cell)
      })

      tbody.append(row)
    })

    table.append(thead)
    table.append(tbody)
    container.append(table)
  }

  // Initial setup
  updateSubjectCount()
  updateTeacherCount()
  updateRoomCount()
})

