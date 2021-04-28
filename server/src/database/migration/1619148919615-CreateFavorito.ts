import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFavorito1619148919615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'favorito',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'usuario_id',
                    type: 'integer',
                },
                {
                    name: 'receita_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'favoritoUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'favoritoReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
            ],
            uniques: [
                {
                    name: 'favUsuarioReceita',
                    columnNames: [ 'usuario_id', 'receita_id' ]
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('favorito');
    }

}