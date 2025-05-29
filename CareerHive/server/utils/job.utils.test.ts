import { parseRequirements } from './job.utils';

describe('Job Utils - parseRequirements', () => {
    it('should return an empty array for an undefined input', () => {
        expect(parseRequirements(undefined)).toEqual([]);
    });

    it('should return an empty array for an empty string', () => {
        expect(parseRequirements('')).toEqual([]);
    });

    it('should correctly parse a single requirement', () => {
        expect(parseRequirements('Node.js')).toEqual(['Node.js']);
    });

    it('should correctly parse multiple requirements', () => {
        expect(parseRequirements('Node.js,TypeScript,Jest')).toEqual(['Node.js', 'TypeScript', 'Jest']);
    });

    it('should trim whitespace from requirements', () => {
        expect(parseRequirements('  React  ,  Redux ,   CSS  ')).toEqual(['React', 'Redux', 'CSS']);
    });

    it('should handle leading/trailing commas and empty segments', () => {
        expect(parseRequirements(',JavaScript,Python,,')).toEqual(['JavaScript', 'Python']);
    });

    it('should return an empty array for a string with only commas and spaces', () => {
        expect(parseRequirements(' , , , ')).toEqual([]);
    });
}); 