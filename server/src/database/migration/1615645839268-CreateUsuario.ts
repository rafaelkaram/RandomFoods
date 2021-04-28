import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsuario1615645839268 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'usuario',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'id_externo',
                    type: 'varchar',
                    length: '64',
                    isNullable: true,
                },
                {
                    name: 'login',
                    type: 'varchar',
                    length: '20',
                    isUnique: true,
                },
                {
                    name: 'nome',
                    type: 'varchar',
                    length: '64',
                    isNullable: true
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '30',
                    isUnique: true
                },
                {
                    name: 'senha',
                    type: 'varchar',
                    length: '64'
                },
                {
                    name: 'data_cadastro',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'ativo',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'troca_login',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'perfil',
                    type: 'enum',
                    enum: [ 'ADMIN', 'PRO', 'VERIFICADO', 'USUARIO' ]
                },
                {
                    name: 'notificar_seguidor',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'notificar_avaliacao',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'notificar_comentario',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'notificar_favorito',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'notificar_resposta',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'notificar_marca',
                    type: 'boolean',
                    default: true
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('usuario');
    }

}