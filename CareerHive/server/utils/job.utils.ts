export const parseRequirements = (requirementsString?: string): string[] => {
    if (!requirementsString) {
        return [];
    }
    return requirementsString.split(',').map(req => req.trim()).filter(req => req.length > 0);
}; 