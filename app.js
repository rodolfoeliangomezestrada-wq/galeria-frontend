const API_URL = "https://galeria-backend-d70u.onrender.com/api/multimedia";

async function cargarGaleria() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";
    datos.forEach(item => {
      const tagsHtml = item.tags && item.tags.length > 0
        ? item.tags.map(t => `<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">#${t}</span>`).join(' ')
        : '<span class="text-gray-400 text-xs">Sin etiquetas</span>';

      galeria.innerHTML += `
        <div class="bg-white rounded-lg shadow-md p-4" id="card-${item._id}">
          <img src="${item.imagenUrl}" alt="${item.titulo}" class="w-full h-48 object-cover rounded mb-3">
          <h3 class="font-bold text-lg text-gray-800" id="titulo-${item._id}">${item.titulo}</h3>
          <p class="text-gray-500 text-sm mb-2" id="desc-${item._id}">${item.descripcion || ''}</p>
          <div class="flex flex-wrap gap-1 mb-3" id="tags-${item._id}">${tagsHtml}</div>
          <audio controls src="${item.audioUrl}" class="w-full mb-3"></audio>
          <div class="flex gap-2">
            <button onclick="editarElemento('${item._id}')" class="flex-1 bg-yellow-400 text-white py-1 rounded font-bold hover:bg-yellow-500">✏️ Editar</button>
            <button onclick="eliminarElemento('${item._id}')" class="flex-1 bg-red-500 text-white py-1 rounded font-bold hover:bg-red-600">🗑️ Eliminar</button>
          </div>
        </div>`;
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

async function subirElemento() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const tags = document.getElementById("tags").value;
  const imagen = document.getElementById("imagen").files[0];
  const audio = document.getElementById("audio").files[0];

  if (!titulo || !imagen || !audio) {
    alert("Por favor llena el título y selecciona imagen y audio");
    return;
  }

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("descripcion", descripcion);
  formData.append("tags", tags);
  formData.append("imagen", imagen);
  formData.append("audio", audio);

  try {
    const res = await fetch(API_URL, { method: "POST", body: formData });
    if (res.ok) {
      alert("¡Guardado con éxito en la nube!");
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("tags").value = "";
      document.getElementById("imagen").value = "";
      document.getElementById("audio").value = "";
      cargarGaleria();
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

async function editarElemento(id) {
  const nuevoTitulo = prompt("Nuevo título:", document.getElementById(`titulo-${id}`).textContent);
  const nuevaDesc = prompt("Nueva descripción:", document.getElementById(`desc-${id}`).textContent);
  const nuevosTags = prompt("Nuevas etiquetas (separadas por comas):");
  if (!nuevoTitulo) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: nuevoTitulo, descripcion: nuevaDesc, tags: nuevosTags })
  });
  cargarGaleria();
}

async function eliminarElemento(id) {
  if (!confirm("¿Eliminar este elemento?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarGaleria();
}
    
cargarGaleria();