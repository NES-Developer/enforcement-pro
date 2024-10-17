export function UpperCaseWords(enviro_post: any): any {
    const exclude = ['offence_images', 'signature']; // Exclude these keys

    Object.keys(enviro_post).forEach(key => {
        if (enviro_post[key] && typeof enviro_post[key] === 'string') {
            if (key === 'post_code') {
                // Make post_code all uppercase
                enviro_post[key] = enviro_post[key].toUpperCase();
            } else if (!exclude.includes(key)) {
                // Capitalize words for other keys, except the excluded ones
                enviro_post[key] = capitalizeWords(enviro_post[key]);
            }
        }
    });

    return enviro_post;
}

function capitalizeWords(name: string): string {
    if (!name) return '';
    return name.split(' ')
               .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
               .join(' ');
}
