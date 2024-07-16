import redis from "../lib/redis";

async function getKeysWithPrefix(prefix: string) {
    try {
        const keys = [];
        let cursor = '0';
    
        do {
          const result = await redis.scan(cursor, 'MATCH', prefix + "*");
          cursor = result[0];
          keys.push(...result[1]);
        } while (cursor !== '0');
    
        return keys;
      } catch (error) {
        console.error('Error retrieving keys:', error);
      }

      return [];
}

export default getKeysWithPrefix;