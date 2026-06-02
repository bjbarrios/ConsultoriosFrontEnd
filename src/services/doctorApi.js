const API_URL = `${process.env.REACT_APP_API_URL}/doctors`;

async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    if (response.status === 204) return null;
    return response.json();
}

function toDoctor(apiDoctor) {
    return {
        id: String(apiDoctor.id),
        name: apiDoctor.name,
        numberDocument: apiDoctor.numberDocument,
        typeDocument: apiDoctor.typeDocument,
        email: apiDoctor.email,
        phone: apiDoctor.phone,
        specialty: apiDoctor.specialty ? { id: apiDoctor.specialty.id, title: apiDoctor.specialty.title } : null,
        profile: apiDoctor.profile ? { phone: apiDoctor.profile.phone, bio: apiDoctor.profile.bio } : null,
        status: apiDoctor.status === 'INACTIVE' ? 'Inactive' : 'Active'
    };
}

export async function getDoctors(page = 0, size = 50) {
    const url = `${API_URL}?page=${page}&size=${size}`;
    const response = await requestJson(url, { method: 'GET' });
    if (response && response.content) return response.content.map(toDoctor);
    return [];
}

export async function getDoctorById(doctorId) {
    const doctor = await requestJson(`${API_URL}/${doctorId}`, { method: 'GET' });
    return toDoctor(doctor);
}

export async function createDoctor(doctorData) {
    const created = await requestJson(API_URL, { 
        method: 'POST', 
        body: JSON.stringify(doctorData) 
    });
    return toDoctor(created);
}

export async function replaceDoctor(doctorId, doctorData) {
    const updated = await requestJson(`${API_URL}/${doctorId}`, { 
        method: 'PUT', 
        body: JSON.stringify(doctorData) 
    });
    return toDoctor(updated);
}
