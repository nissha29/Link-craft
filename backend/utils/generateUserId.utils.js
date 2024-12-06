import crypto from 'crypto'

export default function generateUserId() {
    return crypto.randomUUID()
}
 
 