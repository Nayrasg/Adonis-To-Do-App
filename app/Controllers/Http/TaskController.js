'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {

    async index({ view }) {
        const tasks = await Task.all()
        return view.render('tasks.index', { tasks: tasks.toJSON() })

    }

    /* Primero, validamos las solicitudes que provienen del formulario contra algunas reglas. 
    Si la validación falla, simplemente guardamos los mensajes de validación en la sesión y 
    volvemos al formulario con los mensajes de error. Si todo salió bien, guardamos la nueva tarea en la 
    base de datos y mostramos un mensaje de notificación que indica que la tarea se agregó correctamente y 
    luego redirigimos al formulario.*/

    async store ({ request, response, session }) {
        // Validación para los datos de entrada
        const validation = await validate(request.all(), {
          title: 'required|min:3|max:255'
        })
      
        // Mostrar mensajes de error si falla la validación
        if (validation.fails()) {
          session.withErrors(validation.messages())
                  .flashAll()
          return response.redirect('back')
        }
      
        // Guardar en la base de datos
        const task = new Task()
        task.title = request.input('title')
        await task.save()
      
        // Guaradar mensaje de éxito
        session.flash({ notification: '¡Tarea agregada con éxito!' })
      
        return response.redirect('back')
      }

      async destroy ({ params, session, response }) {
        const task = await Task.find(params.id)
        await task.delete()
        // Guaradar mensaje de éxito
        session.flash({ notification: '¡Tarea eliminada con éxito!' })
        return response.redirect('back')
      }  
}

module.exports = TaskController
