import Decision from './decision';

const archiveKey = 'decision-list';

export function loadArchive(){
    return JSON.parse(localStorage.getItem(archiveKey) || '[]');
}

export function deleteArchive(){
    localStorage.removeItem(archiveKey);
}

function saveArchive(archive){
    localStorage.setItem(archiveKey, JSON.stringify(archive));
}

export function deleteDecision(id){
    let archive = loadArchive();
    archive = archive.filter( entry => {
        return entry.id !== id;
    });
    saveArchive(archive);
    localStorage.removeItem(id);
}

export function loadDecisionModel(id){
    return JSON.parse(localStorage.getItem(id));
}

export function saveDecision(decision) {
    localStorage.setItem(decision.id, JSON.stringify(decision));

    let archive = loadArchive();
    let existingEntry = archive.find(e => {
        return e.id === decision.id;
    })
    if(existingEntry) {
        existingEntry.name = decision.name;
        existingEntry.date = new Date();
    } else {
        archive.push({
            id: decision.id,
            name: decision.name,
            date: decision.date
        });
    }
    saveArchive(archive);
}