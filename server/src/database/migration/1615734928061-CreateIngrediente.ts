import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateIngrediente1615734928061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ingrediente',
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
                    type: 'varchar'
                },
                {
                    name: 'tipo_ingrediente',
                    type: 'enum',
                    enum: [
                        'CARNE',
                        'CONFEITARIA',
                        'GRAO',
                        'FRUTA',
                        'LATICINIO',
                        'LEGUME',
                        'MASSA',
                        'MOLHO',
                        'OLEO',
                        'OUTROS',
                        'TEMPERO',
                        'VEGETAL'
                    ]
                },
                {
                    name: 'tipo_unidade',
                    type: 'enum',
                    enum: [
                        'VOLUME',
                        'PESO',
                        'UNIDADE'
                    ]
                },
                {
                    name: 'sem_medida',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'derivado_leite',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'gluten',
                    type: 'boolean',
                    default: false
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ingrediente');
    }

}
