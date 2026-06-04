export function fixFirebaseStorageUrl(url: string) {
    if (!url) return url;

    try {
        // Remove espaços e aspas extras
        let cleanUrl = url.trim().replace(/^["']|["']$/g, '');
        
        // Verifica se é uma URL do Firebase Storage
        if (cleanUrl.includes('firebasestorage.googleapis.com')) {
            const urlObj = new URL(cleanUrl);

            // Se o path já contém %2F, a URL já está correta
            if (urlObj.pathname.includes('%2F')) {
                return cleanUrl;
            }

            // Extrai o caminho após /o/
            const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(?:\?|$)/);
            if (pathMatch && pathMatch[1]) {
                const objectPath = pathMatch[1];
                
                // Codifica as barras como %2F
                const encodedPath = objectPath.replace(/\//g, '%2F');

                // Substitui o path original pelo codificado
                const correctedUrl = cleanUrl.replace(
                    `/o/${objectPath}`,
                    `/o/${encodedPath}`
                );
                
                return correctedUrl;
            }
        }

        return cleanUrl;
    } catch (e) {
        console.error("Erro ao corrigir URL do Firebase:", e);
        return url;
    }
}