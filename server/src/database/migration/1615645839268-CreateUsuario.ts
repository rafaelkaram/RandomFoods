import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsuario1615645839268 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'usuario',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nome',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar'
                },
                {
                    name: 'senha',
                    type: 'varchar'
                },
                {
                    name: 'data_cadastro',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'data_ultimo_acesso',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'ativo',
                    type: 'boolean',
                    default: true
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('usuario');
    }

}
