using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

namespace API.Helpers
{
    public static class EntityMapper
    {
        public static TDestination Map<TDestination>(this IMapper mapper, params object[] sources) where TDestination : new()
        {
            return Map(mapper, new TDestination(), sources);
        }

        public static TDestination Map<TDestination>(this IMapper mapper, TDestination destination, params object[] sources) where TDestination : new()
        {
            if (!sources.Any())
                return destination;

            foreach (var src in sources)
                destination = mapper.Map(src, destination);

            return destination;
        }
    }
}