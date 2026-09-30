export function getRepositoryToken(entity: { name: string }): string {
  return `__repository__${entity.name}`;
}

export function InjectRepository(): any {
  return () => undefined;
}

export class TypeOrmModule {
  static forFeature(): any {
    return class {};
  }
}
