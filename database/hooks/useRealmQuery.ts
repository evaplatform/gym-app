// src/database/hooks/useRealmQuery.ts
import { IDefaultEntityProperties } from '@/shared/interfaces/IDefaultEntityProperties';
import { useQuery, useRealm } from '@realm/react';
import { useEffect, useState } from 'react';

// Hook genérico para consultas reativas
export function useRealmQuery<T extends IDefaultEntityProperties>(
  schemaName: string,
  filter?: string,
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  const realm = useRealm();
  const [results, setResults] = useState<T[]>([]);
  
  useEffect(() => {
    // Criar a consulta base
    let query = realm.objects<T>(schemaName).filtered('isDeleted == false');
    
    // Adicionar filtro adicional se fornecido
    if (filter) {
      query = query.filtered(filter);
    }
    
    // Adicionar ordenação se fornecida
    if (sortBy) {
      query = query.sorted(sortBy, sortOrder === 'desc');
    }
    
    // Configurar o listener para mudanças
    const updateResults = () => {
      setResults(Array.from(query));
    };
    
    // Inicializar resultados
    updateResults();
    
    // Adicionar listener
    query.addListener(updateResults);
    
    // Limpar listener quando o componente for desmontado
    return () => {
      query.removeListener(updateResults);
    };
  }, [realm, schemaName, filter, sortBy, sortOrder]);
  
  return results;
}

// Hooks específicos para cada entidade
export function useAcademies(filter?: string) {
  return useRealmQuery('Academy', filter, 'name');
}

export function useExercises(academyId?: string, trainingId?: string) {
  let filter = '';
  
  if (academyId && trainingId) {
    filter = `academyId == "${academyId}" AND "${trainingId}" IN trainingIds`;
  } else if (academyId) {
    filter = `academyId == "${academyId}"`;
  } else if (trainingId) {
    filter = `"${trainingId}" IN trainingIds`;
  }
  
  return useRealmQuery('Exercise', filter, 'name');
}

export function useTrainings(academyId?: string, exerciseType?: string) {
  let filter = '';
  
  if (academyId && exerciseType) {
    filter = `academyId == "${academyId}" AND exerciseType == "${exerciseType}"`;
  } else if (academyId) {
    filter = `academyId == "${academyId}"`;
  } else if (exerciseType) {
    filter = `exerciseType == "${exerciseType}"`;
  }
  
  return useRealmQuery('Training', filter, 'name');
}

// Crie hooks semelhantes para as outras entidades