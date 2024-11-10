import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

export const useGetMembers = ({ workspaceId }: { workspaceId: string}) => {
    const query = useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            const response = await client.api.members.$get({ query: { workspaceId } });

            if(!response.ok) {
                throw new Error("Failed to fetch Members");
            }

            const { data } = await response.json();

            return data;
        },
    })

    return query;
}