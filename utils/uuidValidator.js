import { v4 as uuidv4 } from 'uuid';

export function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
    return regex.test(uuid);
}
export function generateUUID() {
    return uuidv4().replace(/-/g, '');
  }

